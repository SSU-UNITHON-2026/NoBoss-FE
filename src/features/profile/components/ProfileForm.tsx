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
    <div>
      <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 max-w-xl text-base text-ink-600">{subtitle}</p>

      <form className="mt-8 grid grid-cols-[1fr_360px] items-start gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 rounded-xl border border-surface-border p-8">
          <div className="grid grid-cols-2 gap-6">
            <Field label="이름">
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="py-3 text-base" />
            </Field>
            <Field label="학교">
              <Input value={school} onChange={(e) => setSchool(e.target.value)} required className="py-3 text-base" />
            </Field>
            <Field label="학과 / 전공">
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="py-3 text-base"
              />
            </Field>
            <Field label="학번 앞 4자리">
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                maxLength={4}
                required
                className="py-3 text-base"
              />
            </Field>
          </div>

          <div>
            <p className="text-base font-semibold text-ink-900">선호 역할</p>
            <p className="mt-1 text-sm text-ink-600">
              맡고 싶은 역할을 하나 이상 선택하세요. 복수 선택할 수 있고 나중에 수정할 수 있습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {PREFERRED_TASK_TAGS.map((tag) => (
                <Tag key={tag} selected={preferredTasks.includes(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {showInterests ? (
            <Field label="관심 분야 또는 특기">
              <Input
                placeholder="사용자 인터뷰, 프로토타이핑"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="py-3 text-base"
              />
            </Field>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-surface-border bg-surface-muted p-8">
            <p className="text-sm font-semibold text-ink-900">선택한 선호 역할 · {preferredTasks.length}개</p>
            {preferredTasks.length === 0 ? (
              <p className="mt-3 text-sm text-ink-400">아직 선택한 역할이 없습니다.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {preferredTasks.map((tag) => (
                  <Tag key={tag} selected disabled className="cursor-default disabled:opacity-100">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
            <p className="mt-4 text-sm text-ink-600">
              저장하면 역할 분배에서 선호 태그가 겹치는 업무에 살짝 우선 배정됩니다.
            </p>
          </div>

          <div className="flex-1 rounded-xl border border-surface-border p-8">
            <p className="text-sm font-semibold text-ink-900">안내</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
              <li>· 선호 역할은 언제든 다시 선택할 수 있습니다.</li>
              <li>· 선택 즉시 저장되고 별도 확인 절차 없이 반영됩니다.</li>
              <li>· 선택하지 않아도 팀 활동에는 영향이 없습니다.</li>
            </ul>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-4 border-t border-surface-border pt-6">
          <Button className="px-8 py-3 text-base" type="submit">
            {submitLabel}
          </Button>
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
