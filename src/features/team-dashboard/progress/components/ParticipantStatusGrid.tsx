import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Contribution } from '@/types/contribution'
import type { Member } from '@/types/team'

interface ParticipantStatusGridProps {
  members: Member[]
  contributions: Record<string, Contribution>
  currentUserId: string
}

type DisplayStatus = 'delayed' | 'done' | 'in-progress' | 'no-task'

const statusLabel: Record<DisplayStatus, string> = {
  delayed: '지연',
  done: '완료',
  'in-progress': '진행 중',
  'no-task': '할 일 없음',
}

const statusTone: Record<DisplayStatus, 'danger' | 'brand' | 'neutral'> = {
  delayed: 'danger',
  done: 'brand',
  'in-progress': 'neutral',
  'no-task': 'neutral',
}

function deriveStatus(c: Contribution | undefined): DisplayStatus {
  if (!c || c.totalCount === 0) return 'no-task'
  if (c.delayedCount > 0) return 'delayed'
  if (c.completedCount === c.totalCount) return 'done'
  return 'in-progress'
}

// F-15/F-21: 참여자 현황은 로드맵 완료 데이터로 자동 집계된 진행률만 보여준다.
// 팀원 간 비교·평가 점수는 만들지 않는다(팀플 온도 제외 방침).
export function ParticipantStatusGrid({ members, contributions, currentUserId }: ParticipantStatusGridProps) {
  if (members.length === 0) return null

  return (
    <div className="rounded-lg border border-surface-border p-5">
      <p className="font-semibold text-ink-900">참여자 현황</p>
      <p className="mt-1 text-sm text-ink-600">완료한 할 일 기준으로 자동 집계됩니다. 평가나 비교 점수는 없습니다.</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {members.map((member) => {
          const contribution = contributions[member.id]
          const status = deriveStatus(contribution)
          const total = contribution?.totalCount ?? 0
          const completed = contribution?.completedCount ?? 0
          const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

          return (
            <div key={member.id} className="rounded-lg border border-surface-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900">
                    {member.name} {member.id === currentUserId ? '(나)' : ''}
                  </p>
                  <p className="text-xs text-ink-600">
                    완료 {completed} / 배정 {total}
                  </p>
                </div>
                <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
              </div>
              <ProgressBar percent={percent} className="mt-2.5" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
