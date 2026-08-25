import { AI_API_BASE_URL } from '@/lib/env'
import type { ExtractOutlineResponse, OutlineFieldName, SuggestTeamNameResponse } from '@/types/ai'

// AI 백엔드(FastAPI, web-production-dc097.up.railway.app)는 메인 백엔드와 다른 서버라
// { success, data } 래핑이 없다 — src/lib/http.ts를 재사용하지 않고 그대로 JSON을 받는다.
async function aiPost<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${AI_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`AI 서버 오류 (${res.status})`)
  return res.json() as Promise<T>
}

// POST /outline/extract
export const extractOutline = (chatMessages: string[], confirmed: Partial<Record<OutlineFieldName, string>>) =>
  aiPost<ExtractOutlineResponse>('/outline/extract', { chat_messages: chatMessages, confirmed })

// POST /team-name/suggest
export const suggestTeamName = (chatMessages: string[]) =>
  aiPost<SuggestTeamNameResponse>('/team-name/suggest', { chat_messages: chatMessages })
