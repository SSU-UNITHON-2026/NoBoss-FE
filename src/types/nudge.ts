export interface DelayAlert {
  subtaskId: string
  daysOverdue: number
  suggestReassign: boolean
}

export interface Nudge {
  id: string
  fromMemberId: string
  toMemberId: string
  subtaskId?: string
  sentAt: string
}
