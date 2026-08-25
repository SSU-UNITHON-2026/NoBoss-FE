import type { Team } from './team'

export interface ChatMessage {
  id: string
  teamId: string
  authorId: string | 'ai'
  text: string
  sentAt: string
  /** F-28: AI가 자연어에서 인식해 공동설정 폼에 반영한 필드 */
  parsedTeamFields?: Partial<Pick<Team, 'name' | 'courseName' | 'topic' | 'description' | 'dueDate' | 'memberCount'>>
}
