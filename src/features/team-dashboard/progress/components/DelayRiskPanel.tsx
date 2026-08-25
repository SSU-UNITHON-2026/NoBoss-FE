import { Button } from '@/components/ui/Button'
import type { DelayAlert } from '@/types/nudge'
import type { Subtask } from '@/types/task'

interface DelayRiskPanelProps {
  alerts: DelayAlert[]
  subtasksById: Record<string, Subtask>
  memberNameById: Record<string, string>
  onReviewReassign: () => void
}

export function DelayRiskPanel({ alerts, subtasksById, memberNameById, onReviewReassign }: DelayRiskPanelProps) {
  if (alerts.length === 0) return null

  return (
    <div className="rounded-lg border border-brand-500 p-5">
      <p className="font-semibold text-ink-900">지연 위험 · 우선 조치</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const task = subtasksById[alert.subtaskId]
          if (!task) return null
          const ownerLabel = task.assigneeId ? `${memberNameById[task.assigneeId] ?? '팀원'} 지연` : '공동 할 일 지연'
          return (
            <li key={alert.subtaskId} className="rounded-lg border border-danger-500/40 bg-danger-50/60 px-3.5 py-3">
              <p className="text-sm font-medium text-ink-900">{task.title}</p>
              <p className="mt-0.5 text-sm font-semibold text-danger-600">{ownerLabel}</p>
              <p className="mt-0.5 text-xs text-ink-600">
                기한 D-{alert.daysOverdue} · 미완료
              </p>
            </li>
          )
        })}
      </ul>
      <Button variant="secondary" className="mt-3 w-full" onClick={onReviewReassign}>
        재분배 제안 검토
      </Button>
    </div>
  )
}
