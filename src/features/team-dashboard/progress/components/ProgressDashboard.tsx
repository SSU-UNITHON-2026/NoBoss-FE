import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import type { ChatMessage } from '@/types/chat'
import type { DelayAlert } from '@/types/nudge'
import type { RoadmapStep } from '@/types/roadmap'
import { DelayRiskPanel } from './DelayRiskPanel'
import { RoadmapStepList } from './RoadmapStepList'

const currentUserId = 'me'
const memberNameById: Record<string, string> = { [currentUserId]: '나' }

const initialSteps: RoadmapStep[] = []
const initialDelayAlerts: DelayAlert[] = []

export function ProgressDashboard() {
  const [steps, setSteps] = useState<RoadmapStep[]>(initialSteps)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const allSubtasks = useMemo(() => steps.flatMap((s) => s.subtasks), [steps])
  const subtasksById = useMemo(() => Object.fromEntries(allSubtasks.map((t) => [t.id, t])), [allSubtasks])
  const completed = allSubtasks.filter((t) => t.status === 'done').length
  const total = allSubtasks.length
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const activeDelayAlerts = initialDelayAlerts.filter((a) => subtasksById[a.subtaskId]?.status !== 'done')

  function toggleSubtask(subtaskId: string) {
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        subtasks: step.subtasks.map((task) =>
          task.id === subtaskId
            ? { ...task, status: task.status === 'done' ? 'in-progress' : 'done' }
            : task,
        ),
      })),
    )
  }

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: 'unknown', authorId: currentUserId, text, sentAt: new Date().toISOString() },
    ])
  }

  function requestReassign() {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        teamId: 'unknown',
        authorId: 'ai',
        text: '재분배 제안을 준비하고 있습니다. 잠시만 기다려 주세요.',
        sentAt: new Date().toISOString(),
      },
    ])
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-600">과목 · 인원 정보 없음</p>
          <h1 className="text-2xl font-bold text-ink-900">프로젝트</h1>
        </div>
        <Button variant="secondary">계획 수정하기</Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="최종 마감까지" value="-" hint="마감일 없음" />
        <StatCard label="전체 진행률" value={`${progressPercent}%`} hint={`완료 ${completed} / 전체 ${total}`}>
          <ProgressBar percent={progressPercent} className="mt-3" />
        </StatCard>
        <StatCard label="지연 위험" value={`${activeDelayAlerts.length}건`} hint="팀 전체 검토 필요" />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
        <RoadmapStepList
          steps={steps}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          onToggleSubtask={toggleSubtask}
        />

        <div className="flex flex-col gap-6">
          <DelayRiskPanel
            alerts={activeDelayAlerts}
            subtasksById={subtasksById}
            memberNameById={memberNameById}
            onReviewReassign={requestReassign}
          />
          <TeamChatPanel
            memberCount={1}
            messages={messages}
            currentUserId={currentUserId}
            memberNameById={memberNameById}
            quickActions={[
              { label: 'AI 리마인드 보내기', onClick: requestReassign },
              { label: 'AI 재분배 제안 요청', onClick: requestReassign },
            ]}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  )
}
