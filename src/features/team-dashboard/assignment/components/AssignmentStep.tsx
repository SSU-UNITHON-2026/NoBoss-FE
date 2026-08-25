import { Button } from '@/components/ui/Button'

interface AssignmentStepProps {
  onComplete: () => void
}

export function AssignmentStep({ onComplete }: AssignmentStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">역할 분배</h2>
      <p className="mt-1 text-sm text-ink-600">
        완료 이력이 아직 없으면 서브태스크를 균등하게 배정합니다. 각자 확인하거나 교환을 요청할 수 있습니다.
      </p>

      <div className="mt-6 rounded-lg border border-surface-border p-6 text-center text-sm text-ink-400">
        다음 단계에서 과제 유형을 선택하면 서브태스크가 생성되고, 이곳에 배분 제안이 표시됩니다.
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete}>다음 단계로</Button>
      </div>
    </div>
  )
}
