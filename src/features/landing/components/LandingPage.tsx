import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-brand-50 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-3xl px-10">
        <p className="text-sm font-bold tracking-[0.2em] text-brand-600">NOBOSS</p>

        <h1 className="mt-10 text-5xl font-bold leading-[1.15] text-ink-900">
          독촉하는 사람 없이
          <br />
          굴러가는 팀플
        </h1>

        <div className="mt-10 border-t border-surface-border pt-10">
          <div className="flex gap-3">
            <Link
              to="/signup"
              className="rounded-lg border border-brand-500 bg-brand-100 px-6 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-100/70"
            >
              회원가입
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-surface-border bg-white px-6 py-3 text-sm font-semibold text-ink-900 hover:bg-surface-muted"
            >
              로그인
            </Link>
          </div>
        </div>

        <p className="mt-16 text-sm text-ink-400">
          대학생 팀프로젝트 협업 도구 · 역할 분배 · 일정 · 진척을 한 화면에서
        </p>
      </div>
    </div>
  )
}
