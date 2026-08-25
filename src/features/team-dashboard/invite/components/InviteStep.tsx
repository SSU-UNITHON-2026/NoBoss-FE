import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { USE_MOCKS } from '@/lib/env'
import { saveSession } from '@/lib/inviteSessionStore'
import { inviteCode as mockInviteCode, inviteMembers as mockInviteMembers, type InviteMember } from '@/mocks/invite'

interface InviteStepProps {
  onComplete: (members: InviteMember[], code: string) => void
  // 초대 코드로 접속한 경우, 원래 세션의 멤버 명단·코드를 그대로 이어받는다
  joinedSession?: { code: string; members: InviteMember[] }
}

const emptyMembers: InviteMember[] = [{ id: 'me', name: '나', department: '', isMe: true, joined: true }]

function generateInviteCode() {
  return `NB-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function InviteStep({ onComplete, joinedSession }: InviteStepProps) {
  const [members, setMembers] = useState<InviteMember[]>(
    joinedSession?.members ?? (USE_MOCKS ? mockInviteMembers : emptyMembers),
  )
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteCode] = useState(joinedSession?.code ?? (USE_MOCKS ? mockInviteCode : generateInviteCode))
  const joinedCount = members.filter((m) => m.joined).length
  const allJoined = members.length > 1 && joinedCount === members.length

  // F-08: 초대 코드로 다른 브라우저/세션에서 접속했을 때 같은 참여 현황을 볼 수 있도록
  // 참여 현황이 바뀔 때마다 코드 기준으로 저장해둔다.
  useEffect(() => {
    saveSession(inviteCode, members)
  }, [inviteCode, members])

  function toggleJoin(id: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, joined: !m.joined } : m)))
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-ink-900">팀원 초대</h2>
      <p className="mt-2 text-base text-ink-600">
        팀원이 먼저 모여야 시작합니다. 전원이 참여를 확정하면 팀명·과목을 함께 정합니다.
      </p>

      <div className="mt-8 grid flex-1 grid-cols-[1fr_380px] items-stretch gap-6">
        <div className="rounded-xl border border-surface-border p-8">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-ink-900">참여 현황</p>
            <p className="text-base font-semibold text-brand-600">
              {joinedCount} / {members.length}
            </p>
          </div>
          <ProgressBar percent={(joinedCount / members.length) * 100} className="mt-4 h-2.5" />

          <ul className="mt-6 flex flex-col gap-3">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-4 rounded-xl border border-brand-500/30 bg-brand-50/40 px-5 py-4"
              >
                <Avatar name={member.name} className="h-11 w-11 text-base" />
                <div className="flex-1">
                  <p className="font-medium text-ink-900">
                    {member.name} {member.isMe ? '(나)' : ''}
                  </p>
                  {member.department ? <p className="mt-0.5 text-sm text-ink-600">{member.department}</p> : null}
                </div>
                {member.isMe ? (
                  <Badge tone={member.joined ? 'brand' : 'neutral'}>{member.joined ? '참여 완료' : '참여 대기'}</Badge>
                ) : (
                  <button type="button" onClick={() => toggleJoin(member.id)}>
                    <Badge tone={member.joined ? 'brand' : 'neutral'}>{member.joined ? '참여 완료' : '참여 대기'}</Badge>
                  </button>
                )}
              </li>
            ))}
          </ul>
          {members.length === 1 ? (
            <p className="mt-4 text-sm text-ink-400">
              아직 초대한 팀원이 없습니다. 우측에서 이메일을 보내거나 초대 코드를 공유하세요.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-surface-border p-8">
            <p className="text-lg font-semibold text-ink-900">초대하기</p>
            <div className="mt-4">
              <Field label="학교 이메일로 초대">
                <Input
                  placeholder="이름@univ.ac.kr"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="py-2.5"
                />
              </Field>
              <Button variant="secondary" className="mt-3 w-full py-2.5" type="button">
                초대 보내기
              </Button>
            </div>
            <div className="mt-6 border-t border-surface-border pt-6">
              <p className="text-sm font-medium text-ink-900">초대 코드</p>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-surface-border bg-surface-muted px-4 py-3">
                <span className="text-base font-medium text-ink-900">{inviteCode}</span>
                <button
                  type="button"
                  className="text-sm font-medium text-brand-600 hover:underline"
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                >
                  복사
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-surface-border bg-surface-muted p-8">
            <p className="text-sm font-semibold text-ink-900">다음 단계 안내</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
              <li>· 전원이 참여를 확정하면 팀명·과목·마감기한을 함께 정합니다.</li>
              <li>· 초대 코드는 이 세션에 한해 유효하며, 홈 화면에서 코드로도 접속할 수 있습니다.</li>
              <li>· 우측 채팅에서 팀원과 미리 이야기를 나눌 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-surface-border bg-surface-muted p-8 text-center">
        {allJoined ? (
          <Button className="px-8 py-3 text-base" onClick={() => onComplete(members, inviteCode)}>
            다음 단계로
          </Button>
        ) : (
          <>
            <p className="font-semibold text-ink-600">전원 참여 후 다음 단계</p>
            <p className="mt-1 text-sm text-ink-400">팀원을 초대하고 참여를 기다려 주세요.</p>
          </>
        )}
      </div>
    </div>
  )
}
