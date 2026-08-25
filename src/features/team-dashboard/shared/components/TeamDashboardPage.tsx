import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { extractOutline, suggestTeamName } from '@/api/aiOutline'
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
  // F-28: 공동설정 채팅에서 AI가 뽑아낸 값 — CommonInfoStep의 빈 필드를 채우는 데 쓴다
  const [commonInfoDraft, setCommonInfoDraft] = useState<
    Partial<Pick<CommonInfoValue, 'name' | 'courseName' | 'topic' | 'description' | 'dueDate'>>
  >({})
  const [suggestedTeamName, setSuggestedTeamName] = useState(false)
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
    // key로 teamId를 줘서 다른 팀으로 이동하면(예: 홈에서 다른 mock 팀 카드 클릭) 완전히 다시
    // 마운트되도록 한다 — 그래야 로드맵/채팅 등 로컬 state가 이전 팀 것으로 남아있지 않는다.
    return <ProgressDashboard key={teamId} teamId={teamId} />
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

  function appendAiMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: 'setup', authorId: 'ai', text, sentAt: new Date().toISOString() },
    ])
  }

  // F-28: 공동설정 단계에서는 @AI 멘션 없이도 모든 메시지를 채팅에서 팀명/과목명/주제/설명/
  // 마감기한을 뽑아내는 AI 서비스(outline/extract)로 보내고, 좌측 폼의 빈 필드를 채운다.
  // 이미 채워진 필드는 confirmed로 넘겨 절대 덮어쓰지 않는다.
  async function handleCommonInfoChat(text: string, chatLog: string[]) {
    try {
      const confirmed: Record<string, string> = {}
      if (commonInfoDraft.name) confirmed.team_name = commonInfoDraft.name
      if (commonInfoDraft.courseName) confirmed.subject = commonInfoDraft.courseName
      if (commonInfoDraft.topic) confirmed.topic = commonInfoDraft.topic
      if (commonInfoDraft.description) confirmed.description = commonInfoDraft.description
      if (commonInfoDraft.dueDate) confirmed.deadline = commonInfoDraft.dueDate

      const res = await extractOutline(chatLog, confirmed)
      const { outline } = res
      setCommonInfoDraft((prev) => ({
        name: outline.team_name ?? prev.name,
        courseName: outline.subject ?? prev.courseName,
        topic: outline.topic ?? prev.topic,
        description: outline.description ?? prev.description,
        dueDate: outline.deadline ?? prev.dueDate,
      }))
      if (res.confirmation_message) appendAiMessage(res.confirmation_message)

      // 팀명은 아직 없는데 주제·설명이 다 채워졌으면, 팀당 한 번만 후보를 추천한다
      if (!outline.team_name && !commonInfoDraft.name && outline.topic && outline.description && !suggestedTeamName) {
        setSuggestedTeamName(true)
        appendAiMessage('팀명을 추천해드릴까요? 원하시면 "팀명 추천해줘"라고 말씀해 주세요.')
      }
      if (isAiMention(text) && /추천/.test(text)) {
        const nameRes = await suggestTeamName(chatLog)
        if (nameRes.suggestions.length > 0) {
          appendAiMessage(`팀명 후보: ${nameRes.suggestions.join(', ')}`)
        }
      }
    } catch {
      // AI 파싱 실패는 조용히 무시 — 폼 직접 입력은 항상 가능하다
    }
  }

  // @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
  // (단, 공동설정 단계는 F-28에 따라 멘션 없이도 모든 메시지를 파싱 대상으로 삼는다)
  function handleSend(text: string) {
    const userMessage: ChatMessage = {
      id: `local-${messages.length}`,
      teamId: 'setup',
      authorId: currentUserId,
      text,
      sentAt: new Date().toISOString(),
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)

    if (mode.phase === 'setup' && mode.step === 'common-info') {
      const chatLog = nextMessages.filter((m) => m.authorId !== 'ai').map((m) => m.text)
      void handleCommonInfoChat(text, chatLog)
      return
    }

    if (!isAiMention(text)) return
    appendAiMessage('확인했습니다. 요청하신 내용을 처리할게요.')
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
            <CommonInfoStep onComplete={handleCommonInfoComplete} aiDraft={commonInfoDraft} />
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
