// F-23/F-28: 하나의 채팅창에서 AI에게 지시하는 메시지와 팀원끼리의 대화를 구분하기 위한 트리거.
// "@AI"로 시작하는 메시지만 AI 파이프라인이 처리하고, 나머지는 AI가 관여하지 않는 순수 대화로 남긴다.
export const AI_MENTION = '@AI'

const AI_MENTION_PATTERN = /^@ai\b\s?/i

export function isAiMention(text: string): boolean {
  return AI_MENTION_PATTERN.test(text.trimStart())
}

export function stripAiMention(text: string): string {
  return text.trimStart().replace(AI_MENTION_PATTERN, '')
}

export function splitAiMention(text: string): { mention: string; rest: string } | null {
  const trimmed = text.trimStart()
  const match = trimmed.match(AI_MENTION_PATTERN)
  if (!match) return null
  return { mention: match[0].trim(), rest: trimmed.slice(match[0].length) }
}
