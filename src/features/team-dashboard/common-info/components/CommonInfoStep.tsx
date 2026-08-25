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

export type CommonInfoField = keyof CommonInfoValue

interface CommonInfoStepProps {
  value: CommonInfoValue
  // F-28: 우측 채팅에서 AI가 추출한 값도 이 폼에 반영해야 해서 부모(TeamDashboardPage)가
  // 상태를 들고 있는 controlled component로 바꿨다. 필드 단위로 넘겨야 "사용자가 직접 고친
  // 필드"를 구분해 AI가 덮어쓰지 않도록 표시할 수 있다.
  onFieldChange: (field: CommonInfoField, value: string | number) => void
  onComplete: (value: CommonInfoValue) => void
}

const placeholder = {
  name: USE_MOCKS ? onboardTeam.name : '팀 이름을 입력하세요',
  courseName: USE_MOCKS ? onboardTeam.courseName : '과목명을 입력하세요',
  topic: USE_MOCKS ? onboardTeam.topic : '프로젝트 주제를 입력하세요',
}

export function CommonInfoStep({ value, onFieldChange, onComplete }: CommonInfoStepProps) {
  const canProceed = value.name.trim() && value.courseName.trim() && value.topic.trim() && value.dueDate

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">공동 설정</h2>
      <p className="mt-1 text-sm text-ink-600">
        팀명·과목명·프로젝트 주제·설명·마감기한·참여인원을 입력하세요. 우측 채팅에 자연어로 말해도 AI가 인식해 아래
        폼에 반영합니다.
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-surface-border p-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="팀명">
            <Input
              value={value.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder={placeholder.name}
            />
          </Field>
          <Field label="과목명">
            <Input
              value={value.courseName}
              onChange={(e) => onFieldChange('courseName', e.target.value)}
              placeholder={placeholder.courseName}
            />
          </Field>
        </div>
        <Field label="프로젝트 주제">
          <Input
            value={value.topic}
            onChange={(e) => onFieldChange('topic', e.target.value)}
            placeholder={placeholder.topic}
          />
        </Field>
        <Field label="설명">
          <Input value={value.description} onChange={(e) => onFieldChange('description', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="마감기한">
            <Input type="date" value={value.dueDate} onChange={(e) => onFieldChange('dueDate', e.target.value)} />
          </Field>
          <Field label="참여인원">
            <Input
              type="number"
              min={2}
              max={10}
              value={value.memberCount}
              onChange={(e) => onFieldChange('memberCount', Number(e.target.value))}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => onComplete(value)} disabled={!canProceed}>
          다음 단계로
        </Button>
      </div>
    </div>
  )
}
