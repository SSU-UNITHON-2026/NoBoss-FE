import type { ReactNode } from 'react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  children?: ReactNode
}

export function StatCard({ label, value, hint, children }: StatCardProps) {
  return (
    <Card>
      <p className="text-sm text-ink-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-sm text-ink-400">{hint}</p> : null}
      {children}
    </Card>
  )
}
