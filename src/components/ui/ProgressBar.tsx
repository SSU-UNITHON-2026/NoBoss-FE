import { cn } from '@/lib/cn'

interface ProgressBarProps {
  percent: number
  className?: string
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-border', className)}>
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${clamped}%` }} />
    </div>
  )
}
