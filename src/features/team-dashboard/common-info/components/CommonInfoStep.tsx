import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import type { ChatMessage } from '@/types/chat'

interface CommonInfoStepProps {
  onComplete: () => void
}

const currentUserId = 'me'
const memberNameById = { [currentUserId]: '나' }

export function CommonInfoStep({ onComplete }: CommonInfoStepProps) {
  const [name, setName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [memberCount, setMemberCount] = useState(2)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: 'setup', authorId: currentUserId, text, sentAt: new Date().toISOString() },
    ])
  }

  const canProceed = name.trim() && courseName.trim() && topic.trim() && dueDate

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">공동 설정</h2>
      <p className="mt-1 text-sm text-ink-600">
        팀명·과목명·프로젝트 주제·설명·마감기한·참여인원을 입력하세요. 우측 채팅에 자연어로 말해도 AI가 인식해 아래
        폼에 반영합니다.
      </p>

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-surface-border p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="팀명">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="팀 이름을 입력하세요" />
            </Field>
            <Field label="과목명">
              <Input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="과목명을 입력하세요"
              />
            </Field>
          </div>
          <Field label="프로젝트 주제">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="프로젝트 주제를 입력하세요" />
          </Field>
          <Field label="설명">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="마감기한">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
            <Field label="참여인원">
              <Input
                type="number"
                min={2}
                max={10}
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
              />
            </Field>
          </div>
        </div>

        <TeamChatPanel
          memberCount={memberCount}
          messages={messages}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          onSend={handleSend}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete} disabled={!canProceed}>
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
