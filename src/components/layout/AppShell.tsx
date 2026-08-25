import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar usageCount={0} usageLimit={3} />
      {/* key를 경로로 주면 /team/1 → /team/2처럼 같은 라우트 element 안에서 이동할 때도
          매번 다시 마운트되어 애니메이션이 재생된다 */}
      <main key={location.pathname} className="animate-page-enter flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
