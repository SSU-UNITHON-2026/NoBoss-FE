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
