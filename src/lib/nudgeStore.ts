import type { Nudge } from '@/types/nudge'

const STORAGE_KEY = 'noboss.nudges'

function readAll(): Nudge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Nudge[]) : []
  } catch {
    return []
  }
}

function writeAll(nudges: Nudge[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nudges))
}

// F-24: 독촉하기는 발신자 전용 액션 — 발송 이력도 발신자 기기에만 저장하고 팀 채팅이나
// 다른 팀원 화면에는 절대 노출하지 않는다.
export function listSentNudges(teamId: string, fromMemberId: string): Nudge[] {
  return readAll().filter((n) => n.teamId === teamId && n.fromMemberId === fromMemberId)
}

export function sendNudge(teamId: string, fromMemberId: string, toMemberId: string, subtaskId?: string): Nudge {
  const nudge: Nudge = {
    id: `nudge-${Date.now()}`,
    teamId,
    fromMemberId,
    toMemberId,
    subtaskId,
    sentAt: new Date().toISOString(),
  }
  writeAll([...readAll(), nudge])
  return nudge
}
