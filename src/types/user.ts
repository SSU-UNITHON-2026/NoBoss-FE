export const PREFERRED_TASK_TAGS = [
  '기획·PM',
  '리서치',
  '글쓰기·보고서',
  '데이터 분석',
  '디자인',
  '발표·커뮤니케이션',
  '개발·구현',
  '편집·검토',
  '기타',
] as const

export type PreferredTaskTag = (typeof PREFERRED_TASK_TAGS)[number]

export interface User {
  id: string
  name: string
  school: string
  department: string
  studentId: string
  preferredTasks: PreferredTaskTag[]
  interests?: string
}

export const emptyUser: User = {
  id: '',
  name: '',
  school: '',
  department: '',
  studentId: '',
  preferredTasks: [],
  interests: '',
}
