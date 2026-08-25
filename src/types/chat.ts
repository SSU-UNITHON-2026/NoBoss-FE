export interface ChatMessage {
  id: string
  teamId: string
  authorId: string | 'ai'
  text: string
  sentAt: string
}
