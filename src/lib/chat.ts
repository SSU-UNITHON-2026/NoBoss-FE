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

// F-28: "팀명을 추천해드릴까요?" 제안에 대한 동의 여부를 가볍게 판별한다.
// 주의: JS 정규식의 \b(단어 경계)는 아스키 [A-Za-z0-9_] 기준이라 한글 뒤에서는 전혀 매치되지
// 않는다 — "응 추천해줘"처럼 한글 다음에 공백이 와도 \b가 성립하지 않아 "응"이 안 걸린다.
// 그래서 \b 대신 공백/문장부호/끝을 직접 lookahead로 확인한다.
const AFFIRMATIVE_PATTERN = /^(응|어|네|넹|그래|좋아|좋지|콜|추천해\s*줘|추천|ok|okay|yes|y)(?=$|[\s.,!?~])/i

export function isAffirmativeReply(text: string): boolean {
  return AFFIRMATIVE_PATTERN.test(text.trim())
}
