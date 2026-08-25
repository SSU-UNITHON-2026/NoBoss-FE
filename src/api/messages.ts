import { http } from '@/lib/http'
import type { MessageApplyResponse, MessageResponse } from '@/types/message'

// POST /api/v1/messages
export const sendMessage = (text: string) => http.post<MessageResponse>('/messages', { text })

// POST /api/v1/messages/{messageId}/apply
export const applyMessage = (messageId: number) => http.post<MessageApplyResponse>(`/messages/${messageId}/apply`)
