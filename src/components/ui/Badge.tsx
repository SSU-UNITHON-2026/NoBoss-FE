import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'brand' | 'danger' | 'success'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-muted text-ink-600 border-surface-border',
  brand: 'bg-brand-100 text-brand-600 border-brand-500',
  danger: 'bg-danger-50 text-danger-600 border-danger-500',
  success: 'bg-surface-muted text-ink-600 border-surface-border',
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
