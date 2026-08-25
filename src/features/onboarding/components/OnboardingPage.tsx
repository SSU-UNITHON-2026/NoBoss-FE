import { useNavigate } from 'react-router-dom'
import { emptyUser } from '@/types/user'
import { ProfileForm } from '@/features/profile/components/ProfileForm'

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white px-10 py-16">
      <ProfileForm
        title="프로필 설정"
        subtitle="학적 정보와 선호 역할을 입력해 주세요. 저장된 정보는 AI 역할 분배 제안의 참고값으로만 쓰이고, 최종 역할은 팀원이 함께 결정합니다."
        initialValue={emptyUser}
        submitLabel="저장하고 시작하기"
        onSubmit={() => navigate('/home')}
      />
    </div>
  )
}
