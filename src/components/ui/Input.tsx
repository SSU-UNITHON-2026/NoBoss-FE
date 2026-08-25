import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label: string
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  children: ReactNode
}

export function Field({ label, labelProps, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm" {...labelProps}>
      <span className="font-medium text-ink-900">{label}</span>
      {children}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'rounded-lg border border-surface-border bg-surface-muted px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:bg-white',
        className,
      )}
      {...props}
    />
  )
}
