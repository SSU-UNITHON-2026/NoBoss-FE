import type { PreferredTaskTag } from './user'

export type MemberStatus = 'delayed' | 'in-progress' | 'done'

export interface Member {
  id: string
  userId: string
  name: string
  avatarUrl?: string
  preferredTasks: PreferredTaskTag[]
  completedTaskCount: number
  status: MemberStatus
}

export interface Team {
  id: string
  name: string
  courseName: string
  topic: string
  description: string
  dueDate: string
  memberCount: number
  members: Member[]
}

/** 홈/To Do List 카드에서 쓰는 요약 뷰 */
export interface TeamProjectSummary {
  id: string
  title: string
  courseName: string
  memberCount: number
  dueDate: string
  progressPercent: number
  completedCount: number
  totalCount: number
  delayedCount: number
  status: 'delayed' | 'in-progress' | 'done'
}
