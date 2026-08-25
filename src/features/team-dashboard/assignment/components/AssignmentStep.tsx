import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { buildAssignmentSlots } from '@/lib/assignment'
import { getPreferredTasks } from '@/lib/profileStore'
import type { InviteMember } from '@/mocks/invite'

interface AssignmentStepProps {
  onComplete: () => void
  members: InviteMember[]
}

// F-09/F-10 라이트: 완료 이력이 없는 콜드스타트 상태이므로 기본은 균등(라운드로빈) 배정이고,
// "나"의 프로필 선호 태그가 단계와 겹치면 그 단계를 살짝 우선 배정한다. handleRoadmapComplete가
// 프로젝트 생성 시 실제로 쓰는 것과 정확히 같은 함수(buildAssignmentSlots)를 써야 이 화면의
// "제안"이 다음 단계에서 실제로 만들어질 배분과 어긋나지 않는다.
function buildProposal(members: InviteMember[]) {
  const me = members.find((m) => m.isMe)
  const preferredTagsByName = me ? { [me.name]: getPreferredTasks() } : {}
  return buildAssignmentSlots(members, preferredTagsByName).map((slot) => ({ id: `stage-${slot.stage}`, ...slot }))
}

export function AssignmentStep({ onComplete, members }: AssignmentStepProps) {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const [exchangeRequested, setExchangeRequested] = useState<Record<string, boolean>>({})
  const proposal = buildProposal(members)
  const allConfirmed = proposal.every((t) => confirmed[t.id])

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-ink-900">역할 분배</h2>
      <p className="mt-2 text-base text-ink-600">
        완료 이력이 아직 없으면 서브태스크를 균등하게 배정합니다. 각자 확인하거나 교환을 요청할 수 있습니다.
      </p>
      <p className="mt-1 text-sm text-ink-400">
        구체적인 업무 제목은 다음 단계에서 과제 유형을 선택하면 이 배정 순서 그대로 확정됩니다. 프로필에서
        저장한 선호 업무 태그가 단계와 겹치면 배정에 살짝 반영됩니다.
      </p>

      <div className="mt-8 flex-1 rounded-xl border border-surface-border p-8">
        <ul className="flex flex-col gap-4">
          {proposal.map((slot) => (
            <li key={slot.id} className="flex items-center gap-4 rounded-xl border border-surface-border px-5 py-5">
              <Avatar name={slot.owner} className="h-11 w-11 text-base" />
              <div className="flex-1">
                <p className="font-medium text-ink-900">
                  {slot.stage}단계 업무
                  {slot.matchedPreference ? (
                    <span className="ml-2 align-middle text-xs font-medium text-brand-600">선호 태그 반영</span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-sm text-ink-600">제안 담당자 · {slot.owner}</p>
              </div>
              {confirmed[slot.id] ? (
                <Badge tone="brand">확인 완료</Badge>
              ) : exchangeRequested[slot.id] ? (
                <Badge tone="neutral">교환 요청됨</Badge>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setConfirmed((p) => ({ ...p, [slot.id]: true }))}>
                    확인
                  </Button>
                  <Button variant="ghost" onClick={() => setExchangeRequested((p) => ({ ...p, [slot.id]: true }))}>
                    교환 요청
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="px-8 py-3 text-base" onClick={onComplete} disabled={!allConfirmed}>
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
