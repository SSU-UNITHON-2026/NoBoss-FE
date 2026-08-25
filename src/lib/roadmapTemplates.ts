import type { RoadmapStep } from '@/types/roadmap'
import type { TaskTemplateType } from '@/types/task'

export const TASK_TEMPLATES: { type: TaskTemplateType; label: string; steps: string[] }[] = [
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

/** F-12: 마감일 기준으로 템플릿의 5단계에 D-day를 균등 배분한다. */
export function buildRoadmapFromTemplate(templateType: TaskTemplateType, dueDate: string): RoadmapStep[] {
  const template = TASK_TEMPLATES.find((t) => t.type === templateType) ?? TASK_TEMPLATES[0]
  const start = new Date()
  const end = new Date(dueDate)
  const totalMs = Math.max(end.getTime() - start.getTime(), 0)

  return template.steps.map((label, i) => {
    const ratio = (i + 1) / template.steps.length
    const stepDate = new Date(start.getTime() + totalMs * ratio)
    return {
      id: `step-${i + 1}`,
      order: i + 1,
      label: `${i + 1}단계 · ${label}`,
      dueDate: stepDate.toISOString().slice(0, 10),
      status: i === 0 ? 'in-progress' : 'upcoming',
      subtasks: [],
    }
  })
}
