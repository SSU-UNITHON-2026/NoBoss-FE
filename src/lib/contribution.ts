import type { RoadmapStep } from '@/types/roadmap'
import type { Contribution } from '@/types/contribution'

// F-21: 완료/배정 건수만으로 계산하는 사실 기반 집계 — 평가·비교 점수는 만들지 않는다.
export function computeContributions(steps: RoadmapStep[]): Record<string, Contribution> {
  const byMember: Record<string, Contribution> = {}

  for (const step of steps) {
    for (const task of step.subtasks) {
      if (!task.assigneeId) continue
      const entry = byMember[task.assigneeId] ?? {
        memberId: task.assigneeId,
        completedCount: 0,
        totalCount: 0,
        delayedCount: 0,
      }
      entry.totalCount += 1
      if (task.status === 'done') entry.completedCount += 1
      if (task.status === 'delayed') entry.delayedCount += 1
      byMember[task.assigneeId] = entry
    }
  }

  return byMember
}
