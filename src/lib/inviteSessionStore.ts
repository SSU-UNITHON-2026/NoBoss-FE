import type { InviteMember } from '@/mocks/invite'

// 백엔드에 초대 API가 없어, 진행 중인 "새 팀 만들기" 세션(팀원 초대 단계)을 초대 코드
// 기준으로 localStorage에 임시 저장한다. 초대 코드로 접속하면 이 세션을 찾아 같은
// 참여 현황으로 이어서 들어갈 수 있다. 로드맵 확정으로 팀이 실제로 생성되면 삭제한다.
export interface InviteSession {
  code: string
  members: InviteMember[]
  updatedAt: string
}

const STORAGE_KEY = 'noboss.inviteSessions'

function readAll(): InviteSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InviteSession[]) : []
  } catch {
    return []
  }
}

function writeAll(sessions: InviteSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function getSessionByCode(code: string): InviteSession | undefined {
  const normalized = code.trim().toUpperCase()
  return readAll().find((s) => s.code.toUpperCase() === normalized)
}

export function saveSession(code: string, members: InviteMember[]) {
  const all = readAll()
  const index = all.findIndex((s) => s.code === code)
  const next: InviteSession = { code, members, updatedAt: new Date().toISOString() }
  if (index === -1) writeAll([...all, next])
  else writeAll(all.map((s, i) => (i === index ? next : s)))
}

export function deleteSession(code: string) {
  writeAll(readAll().filter((s) => s.code !== code))
}
