export interface ActivityLogEntry {
  id: string
  memberId: string
  subtaskId: string
  action: 'completed'
  timestamp: string
}

export interface Contribution {
  memberId: string
  completedCount: number
  score: number
}
