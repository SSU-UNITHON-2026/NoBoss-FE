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
