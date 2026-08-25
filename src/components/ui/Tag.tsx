import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Tag({ selected, className, ...props }: TagProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        selected
          ? 'border-brand-500 bg-brand-100 text-brand-600'
          : 'border-surface-border bg-white text-ink-600 hover:bg-surface-muted',
        className,
      )}
      {...props}
    />
  )
}
