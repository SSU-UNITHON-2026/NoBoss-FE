import { useNavigate } from 'react-router-dom'
import { emptyUser } from '@/types/user'
import { ProfileForm } from './ProfileForm'

export function ProfilePage() {
  const navigate = useNavigate()

  return (
    <ProfileForm
      title="프로필 설정"
      subtitle="선호 역할은 팀의 역할 분배 논의에서 참고값으로 쓰입니다."
      initialValue={emptyUser}
      showInterests
      submitLabel="저장"
      onSubmit={() => navigate('/home')}
      onCancel={() => navigate('/home')}
    />
  )
}
