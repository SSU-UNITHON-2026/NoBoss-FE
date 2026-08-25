import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar usageCount={0} usageLimit={3} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
