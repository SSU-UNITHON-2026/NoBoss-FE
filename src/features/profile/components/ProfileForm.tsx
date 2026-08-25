import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { Tag } from '@/components/ui/Tag'
import { PREFERRED_TASK_TAGS, type PreferredTaskTag, type User } from '@/types/user'

interface ProfileFormProps {
  title: string
  subtitle: string
  initialValue: User
  showInterests?: boolean
  submitLabel: string
  onSubmit: (value: User) => void
  onCancel?: () => void
}

export function ProfileForm({
  title,
  subtitle,
  initialValue,
  showInterests = false,
  submitLabel,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState(initialValue.name)
  const [school, setSchool] = useState(initialValue.school)
  const [department, setDepartment] = useState(initialValue.department)
  const [studentId, setStudentId] = useState(initialValue.studentId)
  const [interests, setInterests] = useState(initialValue.interests ?? '')
  const [preferredTasks, setPreferredTasks] = useState<PreferredTaskTag[]>(initialValue.preferredTasks)

  function toggleTag(tag: PreferredTaskTag) {
    setPreferredTasks((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ ...initialValue, name, school, department, studentId, interests, preferredTasks })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
      <p className="mt-1.5 max-w-xl text-sm text-ink-600">{subtitle}</p>

      <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="이름">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="학교">
            <Input value={school} onChange={(e) => setSchool(e.target.value)} required />
          </Field>
          <Field label="학과 / 전공">
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </Field>
          <Field label="학번 앞 4자리">
            <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} maxLength={4} required />
          </Field>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">선호 역할</p>
          <p className="mt-1 text-sm text-ink-600">
            맡고 싶은 역할을 하나 이상 선택하세요. 복수 선택할 수 있고 나중에 수정할 수 있습니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PREFERRED_TASK_TAGS.map((tag) => (
              <Tag key={tag} selected={preferredTasks.includes(tag)} onClick={() => toggleTag(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-400">선택한 역할 {preferredTasks.length}개</p>
        </div>

        {showInterests ? (
          <Field label="관심 분야 또는 특기">
            <Input
              placeholder="사용자 인터뷰, 프로토타이핑"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </Field>
        ) : null}

        <div className="flex items-center gap-4 border-t border-surface-border pt-6">
          <Button type="submit">{submitLabel}</Button>
          {onCancel ? (
            <button type="button" onClick={onCancel} className="text-sm text-ink-600 hover:underline">
              취소
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
