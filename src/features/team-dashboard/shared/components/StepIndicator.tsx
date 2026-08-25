import { cn } from '@/lib/cn'
import type { TeamDashboardSetupStep } from '@/types/dashboard'

const steps: { key: TeamDashboardSetupStep | 'progress'; label: string }[] = [
  { key: 'invite', label: '팀원 초대' },
  { key: 'common-info', label: '공동설정' },
  { key: 'assignment', label: '역할 분배' },
  { key: 'roadmap', label: '로드맵' },
  { key: 'progress', label: '진행 관리' },
]

export function StepIndicator({ current }: { current: TeamDashboardSetupStep | 'progress' }) {
  const currentIndex = steps.findIndex((s) => s.key === current)

  return (
    <ol className="flex items-center">
      {steps.map((step, i) => (
        <li key={step.key} className="flex items-center">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                i === currentIndex
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : i < currentIndex
                    ? 'border-brand-500 text-brand-600'
                    : 'border-surface-border text-ink-400',
              )}
            >
              {i + 1}
            </span>
            <span className={cn('text-sm', i === currentIndex ? 'font-semibold text-ink-900' : 'text-ink-400')}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 ? <span className="mx-4 h-px w-8 bg-surface-border" /> : null}
        </li>
      ))}
    </ol>
  )
}
