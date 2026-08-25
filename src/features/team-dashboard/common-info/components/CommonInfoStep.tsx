import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import { isAiMention } from '@/lib/chat'
import { USE_MOCKS } from '@/lib/env'
import { onboardTeam } from '@/mocks/project'
import type { ChatMessage } from '@/types/chat'

export interface CommonInfoValue {
  name: string
  courseName: string
  topic: string
  description: string
  dueDate: string
  memberCount: number
}

interface CommonInfoStepProps {
  onComplete: (value: CommonInfoValue) => void
}

const currentUserId = 'me'
const memberNameById = { [currentUserId]: '나' }
const placeholder = {
  name: USE_MOCKS ? onboardTeam.name : '팀 이름을 입력하세요',
  courseName: USE_MOCKS ? onboardTeam.courseName : '과목명을 입력하세요',
  topic: USE_MOCKS ? onboardTeam.topic : '프로젝트 주제를 입력하세요',
}

export function CommonInfoStep({ onComplete }: CommonInfoStepProps) {
  const [name, setName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [memberCount, setMemberCount] = useState(USE_MOCKS ? onboardTeam.memberCount : 2)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
  function handleSend(text: string) {
    setMessages((prev) => {
      const next = [
        ...prev,
        { id: `local-${prev.length}`, teamId: 'setup', authorId: currentUserId, text, sentAt: new Date().toISOString() },
      ]
      if (!isAiMention(text)) return next
      return [
        ...next,
        {
          id: `local-${prev.length + 1}`,
          teamId: 'setup',
          authorId: 'ai',
          text: '확인했습니다. 요청하신 내용을 처리할게요.',
          sentAt: new Date().toISOString(),
        },
      ]
    })
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
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholder.name} />
            </Field>
            <Field label="과목명">
              <Input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder={placeholder.courseName}
              />
            </Field>
          </div>
          <Field label="프로젝트 주제">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={placeholder.topic} />
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
        <Button
          onClick={() => onComplete({ name, courseName, topic, description, dueDate, memberCount })}
          disabled={!canProceed}
        >
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
