import { http } from '@/lib/http'
import type { MessageApplyResponse, MessageResponse } from '@/types/message'

// POST /api/v1/projects/{projectId}/messages
export const sendMessage = (projectId: number, text: string) =>
  http.post<MessageResponse>(`/projects/${projectId}/messages`, { text })

// POST /api/v1/projects/{projectId}/messages/{messageId}/apply
export const applyMessage = (projectId: number, messageId: number) =>
  http.post<MessageApplyResponse>(`/projects/${projectId}/messages/${messageId}/apply`)
