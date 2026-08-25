import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { AuthLayout } from './AuthLayout'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <AuthLayout title="로그인" subtitle="가입한 학교 이메일과 비밀번호로 로그인하세요.">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="mt-1 w-full">
          로그인
        </Button>
      </form>
      <p className="text-sm text-ink-600">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          회원가입
        </Link>
      </p>
    </AuthLayout>
  )
}
