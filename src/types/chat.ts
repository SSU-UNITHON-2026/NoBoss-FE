import type { AiAction } from './action'

export interface ChatMessage {
  id: string
  teamId: string
  authorId: string | 'ai'
  text: string
  sentAt: string
  /** AI가 채팅에서 인식해 제안한 Action. 사용자가 승인해야 반영됨 (mock 데모 전용) */
  proposedAction?: AiAction
  applied?: boolean
  /** 실서버(POST /api/v1/messages) 연동용 — 이 메시지가 응답한 백엔드 messageId */
  aiMessageId?: number
  /** true면 승인 버튼을 노출한다 (POST /api/v1/messages/{id}/apply) */
  requiresApproval?: boolean
}
