import type { PreferredTaskTag, User } from '@/types/user'

const STORAGE_KEY = 'noboss.profile.preferredTasks'
const INFO_STORAGE_KEY = 'noboss.profile.info'

// F-03: 프로필 화면에서 고른 선호 업무 태그를 저장한다. 백엔드에 프로필 API가 없어 로컬에만 남기고,
// F-10 라이트 버전(역할 분배 라운드로빈 가중치)이 이 값을 읽어 "나"의 배정에 반영한다.
export function getPreferredTasks(fallback: PreferredTaskTag[] = []): PreferredTaskTag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PreferredTaskTag[]) : fallback
  } catch {
    return fallback
  }
}

export function savePreferredTasks(tags: PreferredTaskTag[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
}

type ProfileInfo = Omit<User, 'preferredTasks'>

// F-03: 백엔드에 프로필 API가 없어 이름/학교/학과/학번/관심사도 로컬에 저장한다 — 예전엔 선호
// 태그만 저장되고 나머지는 새로고침할 때마다 mock 기본값으로 되돌아갔다.
export function getProfileInfo(fallback: ProfileInfo): ProfileInfo {
  try {
    const raw = localStorage.getItem(INFO_STORAGE_KEY)
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<ProfileInfo>) } : fallback
  } catch {
    return fallback
  }
}

export function saveProfileInfo(info: ProfileInfo) {
  localStorage.setItem(INFO_STORAGE_KEY, JSON.stringify(info))
}
