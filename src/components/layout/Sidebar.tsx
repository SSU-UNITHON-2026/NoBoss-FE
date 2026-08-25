import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/home', label: '홈' },
  { to: '/todo', label: 'To Do List' },
  { to: '/profile', label: '프로필 설정' },
]

interface SidebarProps {
  usageCount: number
  usageLimit: number
}

export function Sidebar({ usageCount, usageLimit }: SidebarProps) {
  const usagePercent = (usageCount / usageLimit) * 100

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-surface-border bg-white p-6">
      <div>
        <div className="mb-8">
          <p className="text-lg font-bold tracking-tight text-ink-900">NOBOSS</p>
          <p className="text-xs text-ink-400">팀장AI</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-surface-muted text-ink-900' : 'text-ink-600 hover:bg-surface-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-surface-border bg-surface-muted p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-ink-900">이용 등급</span>
            <span className="rounded-full border border-brand-500 bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600">
              무료
            </span>
          </div>
          <p className="mb-1.5 text-xs text-ink-600">
            팀프로젝트 {usageCount} / {usageLimit}개 사용
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${usagePercent}%` }} />
          </div>
        </div>
        <button type="button" className="px-3 text-left text-sm text-ink-400 hover:text-ink-600">
          로그아웃
        </button>
      </div>
    </aside>
  )
}
