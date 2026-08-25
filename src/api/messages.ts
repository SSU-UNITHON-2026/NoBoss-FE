import { http } from '@/lib/http'
import type { ChatMessage } from '@/types/chat'

// POST /api/v1/messages
export const sendMessage = (teamId: string, text: string) =>
  http.post<ChatMessage>('/messages', { teamId, text })

// POST /api/v1/messages/{messageId}/apply
export const applyMessage = (messageId: string) => http.post<ChatMessage>(`/messages/${messageId}/apply`)
