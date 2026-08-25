import { useNavigate } from 'react-router-dom'
import { USE_MOCKS } from '@/lib/env'
import { getPreferredTasks, getProfileInfo, saveProfileInfo, savePreferredTasks } from '@/lib/profileStore'
import { currentUser as mockCurrentUser } from '@/mocks/user'
import { emptyUser } from '@/types/user'
import { ProfileForm } from './ProfileForm'

export function ProfilePage() {
  const navigate = useNavigate()
  const base = USE_MOCKS ? mockCurrentUser : emptyUser
  // F-03: 백엔드에 프로필 API가 없어 이름/학교/학과/학번/관심사/선호 태그를 전부 로컬에 저장한다.
  // F-10 라이트 버전(역할 분배 가중치)이 preferredTasks 값을 읽는다.
  const initialValue = { ...getProfileInfo(base), preferredTasks: getPreferredTasks(base.preferredTasks) }

  return (
    <ProfileForm
      title="프로필 설정"
      subtitle="선호 역할은 팀의 역할 분배 논의에서 참고값으로 쓰입니다."
      initialValue={initialValue}
      showInterests
      submitLabel="저장"
      onSubmit={(value) => {
        saveProfileInfo(value)
        savePreferredTasks(value.preferredTasks)
        navigate('/home')
      }}
      onCancel={() => navigate('/home')}
    />
  )
}
