import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { extractOutline, suggestTeamName } from '@/api/ai'
import { AssignmentStep } from '@/features/team-dashboard/assignment/components/AssignmentStep'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import {
  CommonInfoStep,
  type CommonInfoField,
  type CommonInfoValue,
} from '@/features/team-dashboard/common-info/components/CommonInfoStep'
import { InviteStep } from '@/features/team-dashboard/invite/components/InviteStep'
import { ProgressDashboard } from '@/features/team-dashboard/progress/components/ProgressDashboard'
import { TemplateRoadmapStep } from '@/features/team-dashboard/roadmap/components/TemplateRoadmapStep'
import { isAffirmativeReply, isAiMention } from '@/lib/chat'
import { USE_MOCKS } from '@/lib/env'
import { deleteSession, getSessionByCode } from '@/lib/inviteSessionStore'
import { buildRoadmapFromTemplate } from '@/lib/roadmapTemplates'
import { createTeam } from '@/lib/teamStore'
import type { InviteMember } from '@/mocks/invite'
import { onboardTeam } from '@/mocks/project'
import type { ChatMessage } from '@/types/chat'
import type { TeamDashboardMode, TeamDashboardSetupStep } from '@/types/dashboard'
import type { OutlineFieldName } from '@/types/ai'
import type { TaskTemplateType } from '@/types/task'
import type { Team } from '@/types/team'
import { StepIndicator } from './StepIndicator'

const setupOrder: TeamDashboardSetupStep[] = ['invite', 'common-info', 'assignment', 'roadmap']
const currentUserId = 'me'
const memberNameById = { [currentUserId]: '나' }

// F-28: 공동설정 폼 필드 ↔ AI 백엔드(outline/extract)가 쓰는 필드명 매핑
const FIELD_TO_OUTLINE: Partial<Record<CommonInfoField, OutlineFieldName>> = {
  name: 'team_name',
  courseName: 'subject',
  topic: 'topic',
  description: 'description',
  dueDate: 'deadline',
}

const emptyCommonInfo: CommonInfoValue = {
  name: '',
  courseName: '',
  topic: '',
  description: '',
  dueDate: '',
  memberCount: USE_MOCKS ? onboardTeam.memberCount : 2,
}

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  // 초대 코드로 접속한 경우 홈 화면에서 navigate(..., { state: { joinCode } })로 넘어온다
  const joinCode = (location.state as { joinCode?: string } | null)?.joinCode
  const joinedSession = joinCode ? getSessionByCode(joinCode) : undefined
  const [mode, setMode] = useState<TeamDashboardMode>({ phase: 'setup', step: 'invite' })
  const [commonInfoDraft, setCommonInfoDraft] = useState<CommonInfoValue>(emptyCommonInfo)
  // AI가 채팅에서 파싱한 값이 사용자가 폼에서 직접 고친 필드를 덮어쓰지 않도록 표시해둔다
  const [manualFields, setManualFields] = useState<Set<CommonInfoField>>(new Set())
  const [teamNameSuggestOffered, setTeamNameSuggestOffered] = useState(false)
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

  function handleCommonInfoFieldChange(field: CommonInfoField, value: string | number) {
    setCommonInfoDraft((prev) => ({ ...prev, [field]: value }))
    setManualFields((prev) => new Set(prev).add(field))
  }

  function appendAiMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: 'setup', authorId: 'ai', text, sentAt: new Date().toISOString() },
    ])
  }

  // F-28: 공동설정 채팅은 @AI 멘션 없이도 모든 메시지를 AI 백엔드(outline/extract)로 보내
  // 팀명·과목명·주제·설명·마감기한을 추출해 폼에 반영한다. 사용자가 직접 입력한 필드는
  // confirmed로 넘겨 AI가 덮어쓰지 않게 한다.
  async function runCommonInfoAiTurn(historyTexts: string[], latestText: string) {
    if (teamNameSuggestOffered && isAffirmativeReply(latestText)) {
      setTeamNameSuggestOffered(false)
      try {
        const { suggestions } = await suggestTeamName(historyTexts)
        appendAiMessage(`팀명 후보를 골라보세요: ${suggestions.join(', ')}`)
      } catch {
        appendAiMessage('팀명 추천을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
      return
    }

    const confirmed: Partial<Record<OutlineFieldName, string>> = {}
    for (const field of manualFields) {
      const outlineKey = FIELD_TO_OUTLINE[field]
      if (outlineKey) confirmed[outlineKey] = String(commonInfoDraft[field])
    }

    try {
      const { outline, confirmation_message } = await extractOutline(historyTexts, confirmed)
      setCommonInfoDraft((prev) => ({
        ...prev,
        name: outline.team_name ?? prev.name,
        courseName: outline.subject ?? prev.courseName,
        topic: outline.topic ?? prev.topic,
        description: outline.description ?? prev.description,
        dueDate: outline.deadline ?? prev.dueDate,
      }))
      if (confirmation_message) appendAiMessage(confirmation_message)

      const finalTopic = outline.topic ?? commonInfoDraft.topic
      const finalDescription = outline.description ?? commonInfoDraft.description
      const finalTeamName = outline.team_name ?? commonInfoDraft.name
      if (!teamNameSuggestOffered && finalTopic && finalDescription && !finalTeamName) {
        appendAiMessage('팀명을 추천해드릴까요?')
        setTeamNameSuggestOffered(true)
      }
    } catch {
      appendAiMessage('AI가 메시지를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  function handleSend(text: string) {
    const userMessage: ChatMessage = {
      id: `local-${messages.length}`,
      teamId: 'setup',
      authorId: currentUserId,
      text,
      sentAt: new Date().toISOString(),
    }
    const history = [...messages, userMessage].map((m) => m.text)
    setMessages((prev) => [...prev, userMessage])

    if (mode.phase === 'setup' && mode.step === 'common-info') {
      void runCommonInfoAiTurn(history, text)
      return
    }

    // @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
    if (!isAiMention(text)) return
    appendAiMessage('확인했습니다. 요청하신 내용을 처리할게요.')
  }

  // F-27: 로드맵 확정 시 화면 전환 없이 진행관리 모드로 자동 전환
  function handleRoadmapComplete(templateType: TaskTemplateType) {
    const team: Team = {
      id: `team-${Date.now()}`,
      name: commonInfoDraft.name,
      courseName: commonInfoDraft.courseName,
      topic: commonInfoDraft.topic,
      description: commonInfoDraft.description,
      dueDate: commonInfoDraft.dueDate,
      memberCount: commonInfoDraft.memberCount,
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
    const roadmap = buildRoadmapFromTemplate(templateType, commonInfoDraft.dueDate)
    createTeam(team, roadmap)
    if (activeInviteCode) deleteSession(activeInviteCode)
    navigate(`/team/${team.id}`)
  }

  const isCommonInfoStep = mode.phase === 'setup' && mode.step === 'common-info'

  return (
    <div>
      <StepIndicator current={mode.phase === 'setup' ? mode.step : 'progress'} />
      <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
        <div>
          {mode.phase === 'setup' && mode.step === 'invite' && (
            <InviteStep onComplete={handleInviteComplete} joinedSession={joinedSession} />
          )}
          {isCommonInfoStep && (
            <CommonInfoStep value={commonInfoDraft} onFieldChange={handleCommonInfoFieldChange} onComplete={advance} />
          )}
          {mode.phase === 'setup' && mode.step === 'assignment' && <AssignmentStep onComplete={advance} />}
          {mode.phase === 'setup' && mode.step === 'roadmap' && (
            <TemplateRoadmapStep onComplete={handleRoadmapComplete} />
          )}
        </div>

        <TeamChatPanel
          className="sticky top-6 h-[calc(100vh-160px)]"
          memberCount={commonInfoDraft.memberCount}
          messages={messages}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          onSend={handleSend}
          hint={
            isCommonInfoStep
              ? '이 채팅에서 자연어로 팀명·과목명·주제·설명·마감기한을 말하면 AI가 왼쪽 폼에 채워줍니다.'
              : undefined
          }
        />
      </div>
    </div>
  )
}
