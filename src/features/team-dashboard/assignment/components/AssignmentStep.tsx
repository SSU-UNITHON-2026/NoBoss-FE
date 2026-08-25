import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { members, onboardRoadmap } from '@/mocks/project'

interface AssignmentStepProps {
  onComplete: () => void
}

const proposal = onboardRoadmap[1].subtasks.filter((t) => t.assigneeId)

function memberName(id: string | null) {
  return members.find((m) => m.id === id)?.name ?? '미배정'
}

export function AssignmentStep({ onComplete }: AssignmentStepProps) {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const allConfirmed = proposal.every((t) => confirmed[t.id])

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">역할 분배</h2>
      <p className="mt-1 text-sm text-ink-600">
        완료 이력이 아직 없어 서브태스크를 균등하게 배정했습니다. 각자 확인하거나 교환을 요청하세요.
      </p>

      <ul className="mt-6 flex flex-col gap-2.5">
        {proposal.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-lg border border-surface-border px-4 py-3.5"
          >
            <Avatar name={memberName(task.assigneeId)} />
            <div className="flex-1">
              <p className="font-medium text-ink-900">{task.title}</p>
              <p className="text-sm text-ink-600">제안 담당자 · {memberName(task.assigneeId)}</p>
            </div>
            {confirmed[task.id] ? (
              <Badge tone="brand">확인 완료</Badge>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmed((p) => ({ ...p, [task.id]: true }))}>
                  확인
                </Button>
                <Button variant="ghost">교환 요청</Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete} disabled={!allConfirmed}>
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
