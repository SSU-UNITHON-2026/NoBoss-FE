import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createProject } from '@/api/project'
import { createTask } from '@/api/tasks'
import { AssignmentStep } from '@/features/team-dashboard/assignment/components/AssignmentStep'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import { CommonInfoStep, type CommonInfoValue } from '@/features/team-dashboard/common-info/components/CommonInfoStep'
import { InviteStep } from '@/features/team-dashboard/invite/components/InviteStep'
import { ProgressDashboard } from '@/features/team-dashboard/progress/components/ProgressDashboard'
import { TemplateRoadmapStep } from '@/features/team-dashboard/roadmap/components/TemplateRoadmapStep'
import { buildAssignmentSlots } from '@/lib/assignment'
import { isAiMention } from '@/lib/chat'
import { deleteSession, getSessionByCode } from '@/lib/inviteSessionStore'
import { getPreferredTasks } from '@/lib/profileStore'
import { TASK_TEMPLATES } from '@/lib/roadmapTemplates'
import type { InviteMember } from '@/mocks/invite'
import type { ChatMessage } from '@/types/chat'
import type { TeamDashboardMode, TeamDashboardSetupStep } from '@/types/dashboard'
import type { TaskTemplateType } from '@/types/task'
import { StepIndicator } from './StepIndicator'

const setupOrder: TeamDashboardSetupStep[] = ['invite', 'common-info', 'assignment', 'roadmap']
const currentUserId = 'me'
const memberNameById = { [currentUserId]: '나' }

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  // 초대 코드로 접속한 경우 홈 화면에서 navigate(..., { state: { joinCode } })로 넘어온다
  const joinCode = (location.state as { joinCode?: string } | null)?.joinCode
  const joinedSession = joinCode ? getSessionByCode(joinCode) : undefined
  const [mode, setMode] = useState<TeamDashboardMode>({ phase: 'setup', step: 'invite' })
  const [commonInfo, setCommonInfo] = useState<CommonInfoValue | null>(null)
  const [inviteMembers, setInviteMembers] = useState<InviteMember[]>([])
  const [activeInviteCode, setActiveInviteCode] = useState<string | undefined>(undefined)
  // F-23: 초기 설정 4단계 전체에서 채팅이 상시 노출돼야 하므로, 오케스트레이터가 채팅 상태를
  // 들고 있고 각 단계는 좌측 콘텐츠만 렌더링한다 — 단계 전환에도 대화 내역이 끊기지 않는다.
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // F-06 → F-27: 실제 백엔드(POST /projects)에 프로젝트를 만드는 중임을 표시 — 팀원 초대/역할분배는
  // 백엔드에 API가 없어 여전히 로컬 상태로만 진행하고, 로드맵 확정 시점에만 실서버에 연결한다.
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // 이미 초기 설정을 마친 팀은 바로 진행관리 모드로 진입한다.
  if (teamId !== 'new') {
    return <ProgressDashboard teamId={teamId} />
  }

  function advance() {
    if (mode.phase !== 'setup') return
    const index = setupOrder.indexOf(mode.step)
    const next = setupOrder[index + 1]
    if (next) setMode({ phase: 'setup', step: next })
  }

  function handleInviteComplete(members: InviteMember[], code: string) {
    setInviteMembers(members)
    setActiveInviteCode(code)
    advance()
  }

  function handleCommonInfoComplete(value: CommonInfoValue) {
    setCommonInfo(value)
    advance()
  }

  // @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
  function handleSend(text: string) {
    setMessages((prev) => {
      const next = [
        ...prev,
        { id: `local-${prev.length}`, teamId: 'setup', authorId: currentUserId, text, sentAt: new Date().toISOString() },
      ]
      if (!isAiMention(text)) return next
      return [
        ...next,
        {
          id: `local-${prev.length + 1}`,
          teamId: 'setup',
          authorId: 'ai',
          text: '확인했습니다. 요청하신 내용을 처리할게요.',
          sentAt: new Date().toISOString(),
        },
      ]
    })
  }

  // F-27: 로드맵 확정 시 화면 전환 없이 진행관리 모드로 자동 전환.
  // 실제 백엔드(POST /projects)에 프로젝트를 만들고, 선택한 템플릿의 5단계를 초기 업무로 씨딩한 뒤
  // 그 프로젝트 id로 진행관리 화면(/team/:teamId)에 진입한다 — teamStore(localStorage) 더 이상 사용 안 함.
  async function handleRoadmapComplete(templateType: TaskTemplateType) {
    if (!commonInfo) return

    const template = TASK_TEMPLATES.find((t) => t.type === templateType) ?? TASK_TEMPLATES[0]
    // F-08→F-09/F-10 라이트: 초대 단계에서 참여를 확정한 팀원 명단으로 콜드스타트 균등 배정하되,
    // "나"의 프로필 선호 태그가 단계와 겹치면 살짝 우선 배정한다 — AssignmentStep이 보여준 제안과
    // 정확히 같은 함수(buildAssignmentSlots)를 써야 배정이 어긋나지 않는다.
    // 백엔드 owner 필드는 멤버 id가 아니라 이름 문자열이다.
    const me = inviteMembers.find((m) => m.isMe)
    const preferredTagsByName = me ? { [me.name]: getPreferredTasks() } : {}
    const assignmentSlots = buildAssignmentSlots(inviteMembers, preferredTagsByName)

    setIsCreatingProject(true)
    setCreateError(null)
    try {
      const project = await createProject({
        teamName: commonInfo.name,
        subjectName: commonInfo.courseName,
        projectTopic: commonInfo.topic,
        deadline: commonInfo.dueDate,
        description: commonInfo.description,
      })

      const start = new Date()
      const end = new Date(commonInfo.dueDate)
      const totalMs = Math.max(end.getTime() - start.getTime(), 0)
      await Promise.all(
        template.steps.map((label, i) => {
          const ratio = (i + 1) / template.steps.length
          const dueDate = new Date(start.getTime() + totalMs * ratio).toISOString().slice(0, 10)
          const owner = assignmentSlots[i].owner
          return createTask(project.id, { stage: i + 1, title: label, owner, dueDate })
        }),
      )

      if (activeInviteCode) deleteSession(activeInviteCode)
      navigate(`/team/${project.id}`)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : '프로젝트 생성에 실패했습니다')
    } finally {
      setIsCreatingProject(false)
    }
  }

  return (
    <div>
      <StepIndicator current={mode.phase === 'setup' ? mode.step : 'progress'} />
      <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
        <div className="flex min-h-[calc(100vh-160px)] flex-col">
          {mode.phase === 'setup' && mode.step === 'invite' && (
            <InviteStep onComplete={handleInviteComplete} joinedSession={joinedSession} />
          )}
          {mode.phase === 'setup' && mode.step === 'common-info' && (
            <CommonInfoStep onComplete={handleCommonInfoComplete} />
          )}
          {mode.phase === 'setup' && mode.step === 'assignment' && (
            <AssignmentStep onComplete={advance} members={inviteMembers} />
          )}
          {mode.phase === 'setup' && mode.step === 'roadmap' && (
            <TemplateRoadmapStep
              onComplete={(type) => void handleRoadmapComplete(type)}
              saving={isCreatingProject}
              errorText={createError}
            />
          )}
        </div>

        <TeamChatPanel
          className="sticky top-6 h-[calc(100vh-160px)]"
          memberCount={commonInfo?.memberCount ?? 1}
          messages={messages}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
