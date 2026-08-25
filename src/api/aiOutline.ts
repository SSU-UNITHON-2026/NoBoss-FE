import type { ExtractOutlineResponse, SuggestTeamNameResponse } from '@/types/aiOutline'

// F-28: 공동설정 채팅 자연어 파싱 전용 AI 서비스. noboss-api와 별개의 서버라 응답 포맷도
// { success, data } 래핑 없이 원본 JSON 그대로 온다 — lib/http.ts를 거치지 않고 직접 fetch한다.
const AI_OUTLINE_BASE_URL = 'https://web-production-dc097.up.railway.app'

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AI_OUTLINE_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`AI 서비스 요청 실패 (${res.status})`)
  return (await res.json()) as T
}

// POST /outline/extract
export const extractOutline = (chatMessages: string[], confirmed: Record<string, string>) =>
  request<ExtractOutlineResponse>('/outline/extract', { chat_messages: chatMessages, confirmed })

// POST /team-name/suggest
export const suggestTeamName = (chatMessages: string[]) =>
  request<SuggestTeamNameResponse>('/team-name/suggest', { chat_messages: chatMessages })
