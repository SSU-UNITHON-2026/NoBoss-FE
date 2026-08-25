import type { PreferredTaskTag } from '@/types/user'

const STORAGE_KEY = 'noboss.profile.preferredTasks'

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
