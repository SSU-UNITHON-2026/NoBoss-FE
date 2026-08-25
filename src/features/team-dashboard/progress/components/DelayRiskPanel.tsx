import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { listSentNudges, sendNudge } from '@/lib/nudgeStore'
import type { DelayAlert } from '@/types/nudge'
import type { Subtask } from '@/types/task'

interface DelayRiskPanelProps {
  alerts: DelayAlert[]
  subtasksById: Record<string, Subtask>
  memberNameById: Record<string, string>
  teamId: string
  currentUserId: string
  onReviewReassign: () => void
}

export function DelayRiskPanel({
  alerts,
  subtasksById,
  memberNameById,
  teamId,
  currentUserId,
  onReviewReassign,
}: DelayRiskPanelProps) {
  const [sentCounts, setSentCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    for (const nudge of listSentNudges(teamId, currentUserId)) {
      if (!nudge.subtaskId) continue
      counts[nudge.subtaskId] = (counts[nudge.subtaskId] ?? 0) + 1
    }
    return counts
  })

  if (alerts.length === 0) return null

  // F-24: 독촉하기는 발신자에게만 결과가 보이는 개인 전용 액션 — 팀 채팅이나 다른 팀원
  // 화면에는 절대 노출하지 않는다.
  function handleNudge(subtaskId: string, toMemberId: string) {
    sendNudge(teamId, currentUserId, toMemberId, subtaskId)
    setSentCounts((prev) => ({ ...prev, [subtaskId]: (prev[subtaskId] ?? 0) + 1 }))
  }

  return (
    <div className="rounded-lg border border-brand-500 p-5">
      <p className="font-semibold text-ink-900">지연 위험 · 우선 조치</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const task = subtasksById[alert.subtaskId]
          if (!task) return null
          const canNudge = Boolean(task.assigneeId && task.assigneeId !== currentUserId)
          const ownerLabel = task.assigneeId ? `${memberNameById[task.assigneeId] ?? '팀원'} 지연` : '공동 할 일 지연'
          const sentCount = sentCounts[alert.subtaskId] ?? 0

          return (
            <li key={alert.subtaskId} className="rounded-lg border border-danger-500/40 bg-danger-50/60 px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{task.title}</p>
                  <p className="mt-0.5 text-sm font-semibold text-danger-600">{ownerLabel}</p>
                  <p className="mt-0.5 text-xs text-ink-600">
                    기한{' '}
                    {alert.daysOverdue > 0
                      ? `D-${alert.daysOverdue}`
                      : alert.daysOverdue < 0
                        ? `D+${Math.abs(alert.daysOverdue)}`
                        : 'D-day'}{' '}
                    · 미완료
                  </p>
                </div>
                {canNudge ? (
                  <Button
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => task.assigneeId && handleNudge(alert.subtaskId, task.assigneeId)}
                  >
                    독촉하기
                  </Button>
                ) : null}
              </div>
              {sentCount > 0 ? (
                <p className="mt-2 text-xs text-brand-600">
                  나에게만 보이는 기록 · {memberNameById[task.assigneeId ?? ''] ?? '팀원'}님에게 {sentCount}번 독촉 보냄
                </p>
              ) : null}
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
