import { useNavigate } from 'react-router-dom'
import { USE_MOCKS } from '@/lib/env'
import { saveProfileInfo, savePreferredTasks } from '@/lib/profileStore'
import { currentUser as mockCurrentUser } from '@/mocks/user'
import { emptyUser } from '@/types/user'
import { ProfileForm } from '@/features/profile/components/ProfileForm'

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white px-10 py-16">
      <ProfileForm
        title="프로필 설정"
        subtitle="학적 정보와 선호 역할을 입력해 주세요. 저장된 정보는 AI 역할 분배 제안의 참고값으로만 쓰이고, 최종 역할은 팀원이 함께 결정합니다."
        initialValue={USE_MOCKS ? mockCurrentUser : emptyUser}
        submitLabel="저장하고 시작하기"
        onSubmit={(value) => {
          saveProfileInfo(value)
          savePreferredTasks(value.preferredTasks)
          navigate('/home')
        }}
      />
    </div>
  )
}
