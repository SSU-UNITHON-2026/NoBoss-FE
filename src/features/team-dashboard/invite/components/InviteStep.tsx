import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface InviteStepProps {
  onComplete: () => void
}

interface InviteMember {
  id: string
  name: string
  department: string
  isMe: boolean
  joined: boolean
}

const initialMembers: InviteMember[] = [{ id: 'me', name: '나', department: '', isMe: false, joined: true }]

function generateInviteCode() {
  return `NB-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function InviteStep({ onComplete }: InviteStepProps) {
  const [members] = useState(initialMembers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteCode] = useState(generateInviteCode)
  const joinedCount = members.filter((m) => m.joined).length
  const allJoined = members.length > 1 && joinedCount === members.length

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">팀원 초대</h2>
      <p className="mt-1 text-sm text-ink-600">
        팀원이 먼저 모여야 시작합니다. 전원이 참여를 확정하면 팀명·과목을 함께 정합니다.
      </p>

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
        <div className="rounded-lg border border-surface-border p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink-900">참여 현황</p>
            <p className="text-sm font-semibold text-brand-600">
              {joinedCount} / {members.length}
            </p>
          </div>
          <ProgressBar percent={(joinedCount / members.length) * 100} className="mt-3" />

          <ul className="mt-4 flex flex-col gap-2.5">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-brand-500/30 bg-brand-50/40 px-4 py-3"
              >
                <Avatar name={member.name} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900">
                    {member.name} {member.isMe ? '(나)' : ''}
                  </p>
                  {member.department ? <p className="text-sm text-ink-600">{member.department}</p> : null}
                </div>
                <Badge tone={member.joined ? 'brand' : 'neutral'}>{member.joined ? '참여 완료' : '참여 대기'}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-400">
            아직 초대한 팀원이 없습니다. 우측에서 이메일을 보내거나 초대 코드를 공유하세요.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-surface-border p-5">
            <p className="font-semibold text-ink-900">초대하기</p>
            <div className="mt-3">
              <Field label="학교 이메일로 초대">
                <Input
                  placeholder="이름@univ.ac.kr"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </Field>
              <Button variant="secondary" className="mt-2" type="button">
                초대 보내기
              </Button>
            </div>
            <div className="mt-4 border-t border-surface-border pt-4">
              <p className="text-sm font-medium text-ink-900">초대 코드</p>
              <div className="mt-1.5 flex items-center justify-between rounded-lg border border-surface-border bg-surface-muted px-3 py-2">
                <span className="text-sm text-ink-900">{inviteCode}</span>
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
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-surface-border bg-surface-muted p-6 text-center">
        {allJoined ? (
          <Button onClick={onComplete}>다음 단계로</Button>
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
