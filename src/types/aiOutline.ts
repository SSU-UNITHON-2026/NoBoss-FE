/** web-production-dc097.up.railway.app (NoBoss AI Service) — F-28 공동설정 채팅 파싱 스펙 */
export interface OutlineDraft {
  team_name: string | null
  subject: string | null
  topic: string | null
  description: string | null
  deadline: string | null
  missing_fields: ('team_name' | 'subject' | 'topic' | 'description' | 'deadline')[]
}

export interface ExtractOutlineResponse {
  outline: OutlineDraft
  confirmation_message: string
}

export interface SuggestTeamNameResponse {
  suggestions: string[]
}
