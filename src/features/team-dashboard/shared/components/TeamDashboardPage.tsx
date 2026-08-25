import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AssignmentStep } from '@/features/team-dashboard/assignment/components/AssignmentStep'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import { CommonInfoStep, type CommonInfoValue } from '@/features/team-dashboard/common-info/components/CommonInfoStep'
import { InviteStep } from '@/features/team-dashboard/invite/components/InviteStep'
import { ProgressDashboard } from '@/features/team-dashboard/progress/components/ProgressDashboard'
import { TemplateRoadmapStep } from '@/features/team-dashboard/roadmap/components/TemplateRoadmapStep'
import { isAiMention } from '@/lib/chat'
import { deleteSession, getSessionByCode } from '@/lib/inviteSessionStore'
import { buildRoadmapFromTemplate } from '@/lib/roadmapTemplates'
import { createTeam } from '@/lib/teamStore'
import type { InviteMember } from '@/mocks/invite'
import type { ChatMessage } from '@/types/chat'
import type { TeamDashboardMode, TeamDashboardSetupStep } from '@/types/dashboard'
import type { TaskTemplateType } from '@/types/task'
import type { Team } from '@/types/team'
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

  // F-27: 로드맵 확정 시 화면 전환 없이 진행관리 모드로 자동 전환
  function handleRoadmapComplete(templateType: TaskTemplateType) {
    if (!commonInfo) return

    const team: Team = {
      id: `team-${Date.now()}`,
      name: commonInfo.name,
      courseName: commonInfo.courseName,
      topic: commonInfo.topic,
      description: commonInfo.description,
      dueDate: commonInfo.dueDate,
      memberCount: commonInfo.memberCount,
      // F-08: 초대 단계에서 참여를 확정한 팀원 명단을 그대로 팀 멤버로 넘긴다 — 항상 "나" 1명으로
      // 고정되던 문제를 고침. 초대 단계를 건너뛴 경로(온보드 mock 등)를 대비해 폴백을 남겨둔다.
      members:
        inviteMembers.length > 0
          ? inviteMembers.map((m) => ({
              id: m.id,
              userId: m.id,
              name: m.name,
              preferredTasks: [],
              completedTaskCount: 0,
              status: 'in-progress',
            }))
          : [{ id: 'me', userId: 'me', name: '나', preferredTasks: [], completedTaskCount: 0, status: 'in-progress' }],
    }
    const roadmap = buildRoadmapFromTemplate(templateType, commonInfo.dueDate)
    createTeam(team, roadmap)
    if (activeInviteCode) deleteSession(activeInviteCode)
    navigate(`/team/${team.id}`)
  }

  return (
    <div>
      <StepIndicator current={mode.phase === 'setup' ? mode.step : 'progress'} />
      <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
        <div>
          {mode.phase === 'setup' && mode.step === 'invite' && (
            <InviteStep onComplete={handleInviteComplete} joinedSession={joinedSession} />
          )}
          {mode.phase === 'setup' && mode.step === 'common-info' && (
            <CommonInfoStep onComplete={handleCommonInfoComplete} />
          )}
          {mode.phase === 'setup' && mode.step === 'assignment' && <AssignmentStep onComplete={advance} />}
          {mode.phase === 'setup' && mode.step === 'roadmap' && (
            <TemplateRoadmapStep onComplete={handleRoadmapComplete} />
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
