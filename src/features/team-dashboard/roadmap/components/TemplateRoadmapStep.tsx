import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { TaskTemplateType } from '@/types/task'

interface TemplateRoadmapStepProps {
  onComplete: () => void
}

const templates: { type: TaskTemplateType; label: string; steps: string[] }[] = [
  {
    type: 'presentation',
    label: '발표형',
    steps: ['문제정의', '시장/사례조사', '슬라이드 디자인', '대본 작성', '리허설'],
  },
  {
    type: 'development',
    label: '개발형',
    steps: ['기획/요구사항 정리', '디자인(와이어프레임)', '프론트엔드 개발', '백엔드 개발', '테스트/디버깅'],
  },
  {
    type: 'report',
    label: '리포트형',
    steps: ['주제 조사', '자료 수집·정리', '초안 작성', '편집/교정', '참고문헌 정리'],
  },
]

export function TemplateRoadmapStep({ onComplete }: TemplateRoadmapStepProps) {
  const [selected, setSelected] = useState<TaskTemplateType | null>(null)
  const activeTemplate = templates.find((t) => t.type === selected)

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">로드맵</h2>
      <p className="mt-1 text-sm text-ink-600">과제 유형을 선택하면 서브태스크와 마감일 기반 D-day가 자동 산출됩니다.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <button key={template.type} type="button" onClick={() => setSelected(template.type)}>
            <Card
              className={cn(
                'h-full text-left transition-colors',
                selected === template.type ? 'border-brand-500 bg-brand-50/40' : 'hover:bg-surface-muted',
              )}
            >
              <p className="font-semibold text-ink-900">{template.label}</p>
              <ol className="mt-3 flex flex-col gap-1 text-sm text-ink-600">
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

      {activeTemplate ? (
        <div className="mt-6 rounded-lg border border-surface-border p-5">
          <p className="font-semibold text-ink-900">{activeTemplate.label} 로드맵 미리보기</p>
          <ol className="mt-3 flex flex-col divide-y divide-surface-border">
            {activeTemplate.steps.map((step, i) => (
              <li key={step} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink-900">
                  {i + 1}단계 · {step}
                </span>
                <span className="text-ink-400">마감일 기준 자동 산출</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button onClick={onComplete} disabled={!selected}>
          로드맵 확정
        </Button>
      </div>
    </div>
  )
}
