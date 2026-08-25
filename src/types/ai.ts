export type OutlineFieldName = 'team_name' | 'subject' | 'topic' | 'description' | 'deadline'

export interface OutlineDraft {
  team_name: string | null
  subject: string | null
  topic: string | null
  description: string | null
  /** YYYY-MM-DD */
  deadline: string | null
  missing_fields: OutlineFieldName[]
}

export interface ExtractOutlineResponse {
  outline: OutlineDraft
  /** 이번 호출에서 새로 채워진 필드만 요약한 메시지. 새로 채워진 게 없으면 빈 문자열 */
  confirmation_message: string
}

export interface SuggestTeamNameResponse {
  /** 확정하지 않은 후보 3~5개 */
  suggestions: string[]
}
