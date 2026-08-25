import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { USE_MOCKS } from '@/lib/env'
import { onboardTeam } from '@/mocks/project'

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

  const canProceed = name.trim() && courseName.trim() && topic.trim() && dueDate

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-ink-900">공동 설정</h2>
      <p className="mt-2 text-base text-ink-600">
        팀명·과목명·프로젝트 주제·설명·마감기한·참여인원을 입력하세요. 우측 채팅에 자연어로 말해도 AI가 인식해 아래
        폼에 반영합니다.
      </p>

      <div className="mt-8 flex flex-1 flex-col gap-6 rounded-xl border border-surface-border p-8">
        <div className="grid grid-cols-2 gap-6">
          <Field label="팀명">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder.name}
              className="py-3 text-base"
            />
          </Field>
          <Field label="과목명">
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder={placeholder.courseName}
              className="py-3 text-base"
            />
          </Field>
        </div>
        <Field label="프로젝트 주제">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder.topic}
            className="py-3 text-base"
          />
        </Field>
        <Field label="설명">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-lg border border-surface-border bg-surface-muted px-3 py-3 text-base text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:bg-white"
            placeholder="프로젝트를 한두 문장으로 설명해 주세요"
          />
        </Field>
        <div className="grid grid-cols-2 gap-6">
          <Field label="마감기한">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="py-3 text-base"
            />
          </Field>
          <Field label="참여인원">
            <Input
              type="number"
              min={2}
              max={10}
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              className="py-3 text-base"
            />
          </Field>
        </div>
        <div className="flex-1 rounded-xl border border-surface-border bg-surface-muted p-6">
          <p className="text-sm font-semibold text-ink-900">다음 단계 안내</p>
          <p className="mt-2 text-sm text-ink-600">
            여기서 정한 마감기한을 기준으로 다음 단계(역할 분배·로드맵)의 업무별 마감일이 자동 산출됩니다.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          className="px-8 py-3 text-base"
          onClick={() => onComplete({ name, courseName, topic, description, dueDate, memberCount })}
          disabled={!canProceed}
        >
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
