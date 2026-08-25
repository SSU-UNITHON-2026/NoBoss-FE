import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <p className="text-sm font-bold tracking-[0.2em] text-brand-600">NOBOSS</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-600">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-5">{children}</div>
      </div>
    </div>
  )
}
