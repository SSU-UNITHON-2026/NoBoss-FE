import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { AuthLayout } from './AuthLayout'

export function SignupForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/onboarding')
  }

  return (
    <AuthLayout title="계정 만들기" subtitle="학교 이메일로 가입하면 같은 수업 팀원을 바로 초대할 수 있습니다.">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Field label="이메일 주소">
          <Input
            type="email"
            placeholder="you@univ.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="비밀번호">
          <Input
            type="password"
            placeholder="8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </Field>
        <Field label="비밀번호 확인">
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="mt-1 w-full">
          가입하고 프로필 만들기
        </Button>
      </form>
      <p className="text-sm text-ink-600">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          로그인
        </Link>
      </p>
    </AuthLayout>
  )
}
