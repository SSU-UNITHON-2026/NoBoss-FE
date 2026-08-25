import { useNavigate } from 'react-router-dom'
import { USE_MOCKS } from '@/lib/env'
import { getPreferredTasks, savePreferredTasks } from '@/lib/profileStore'
import { currentUser as mockCurrentUser } from '@/mocks/user'
import { emptyUser } from '@/types/user'
import { ProfileForm } from './ProfileForm'

export function ProfilePage() {
  const navigate = useNavigate()
  const base = USE_MOCKS ? mockCurrentUser : emptyUser
  // F-03: 백엔드에 프로필 API가 없어 선호 업무 태그만 로컬에 저장해두고, F-10 라이트 버전(역할 분배
  // 가중치)이 이 값을 읽는다.
  const initialValue = { ...base, preferredTasks: getPreferredTasks(base.preferredTasks) }

  return (
    <ProfileForm
      title="프로필 설정"
      subtitle="선호 역할은 팀의 역할 분배 논의에서 참고값으로 쓰입니다."
      initialValue={initialValue}
      showInterests
      submitLabel="저장"
      onSubmit={(value) => {
        savePreferredTasks(value.preferredTasks)
        navigate('/home')
      }}
      onCancel={() => navigate('/home')}
    />
  )
}
