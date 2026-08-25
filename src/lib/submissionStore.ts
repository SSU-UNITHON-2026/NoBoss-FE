import type { Submission } from '@/types/task'

const STORAGE_KEY = 'noboss.todo.submissions'

// F-19: 백엔드에 산출물(파일/링크+메모) 저장 API가 없다. brower objectURL은 새로고침하면 깨지므로
// 파일 첨부는 이름만, 링크 첨부는 URL 그대로 로컬에 남겨서 새로고침해도 완료 기록이 사라지지 않게 한다.
function readAll(): Record<string, Submission> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Submission>) : {}
  } catch {
    return {}
  }
}

export function getAllSubmissions(): Record<string, Submission> {
  return readAll()
}

export function saveSubmission(subtaskId: string, submission: Submission) {
  const all = readAll()
  all[subtaskId] = submission
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function clearSubmission(subtaskId: string) {
  const all = readAll()
  delete all[subtaskId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
