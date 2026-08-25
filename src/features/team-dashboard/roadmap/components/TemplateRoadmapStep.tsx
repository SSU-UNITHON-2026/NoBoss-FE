import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { TASK_TEMPLATES } from '@/lib/roadmapTemplates'
import type { TaskTemplateType } from '@/types/task'

interface TemplateRoadmapStepProps {
  onComplete: (templateType: TaskTemplateType) => void
  saving?: boolean
  errorText?: string | null
}

export function TemplateRoadmapStep({ onComplete, saving, errorText }: TemplateRoadmapStepProps) {
  const [selected, setSelected] = useState<TaskTemplateType | null>(null)
  const activeTemplate = TASK_TEMPLATES.find((t) => t.type === selected)

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-ink-900">로드맵</h2>
      <p className="mt-2 text-base text-ink-600">과제 유형을 선택하면 서브태스크와 마감일 기반 D-day가 자동 산출됩니다.</p>

      <div className="mt-8 grid grid-cols-3 gap-5">
        {TASK_TEMPLATES.map((template) => (
          <button key={template.type} type="button" onClick={() => setSelected(template.type)} className="h-full">
            <Card
              className={cn(
                'h-full min-h-[220px] p-6 text-left transition-colors',
                selected === template.type ? 'border-brand-500 bg-brand-50/40' : 'hover:bg-surface-muted',
              )}
            >
              <p className="text-lg font-semibold text-ink-900">{template.label}</p>
              <ol className="mt-4 flex flex-col gap-2 text-sm text-ink-600">
                {template.steps.map((step, i) => (
                  <li key={step}>
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </Card>
          </button>
        ))}
      </div>

      <div className="mt-8 flex-1 rounded-xl border border-surface-border p-8">
        {activeTemplate ? (
          <>
            <p className="text-lg font-semibold text-ink-900">{activeTemplate.label} 로드맵 미리보기</p>
            <ol className="mt-4 flex flex-col divide-y divide-surface-border">
              {activeTemplate.steps.map((step, i) => (
                <li key={step} className="flex items-center justify-between py-4 text-sm">
                  <span className="text-ink-900">
                    {i + 1}단계 · {step}
                  </span>
                  <span className="text-ink-400">마감일 기준 자동 산출</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-sm text-ink-400">과제 유형을 선택하면 여기에 5단계 로드맵 미리보기가 표시됩니다.</p>
        )}
      </div>

      {errorText ? <p className="mt-4 text-sm text-danger-600">{errorText}</p> : null}

      <div className="mt-6 flex justify-end">
        <Button className="px-8 py-3 text-base" onClick={() => selected && onComplete(selected)} disabled={!selected || saving}>
          {saving ? '프로젝트 생성 중…' : '로드맵 확정'}
        </Button>
      </div>
    </div>
  )
}
