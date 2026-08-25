import type { AiAction } from './action'

export interface ChatMessage {
  id: string
  teamId: string
  authorId: string | 'ai'
  text: string
  sentAt: string
  /** AI가 채팅에서 인식해 제안한 Action. 사용자가 승인해야 반영됨 */
  proposedAction?: AiAction
  applied?: boolean
}
