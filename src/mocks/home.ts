import type { PriorityItem } from '@/types/home'

// mocks/project.ts 로드맵의 실제 서브태스크와 제목·단계·마감일을 맞춰뒀다.
export const priorityItems: PriorityItem[] = [
  {
    id: 'pri-1',
    title: '센서 로그 결측치 처리',
    subtitle: '센서 데이터 이상탐지 모델링 · 전처리 단계',
    dueDate: '2026-08-22',
  },
  {
    id: 'pri-2',
    title: '베이스라인 모델 성능 정리',
    subtitle: '센서 데이터 이상탐지 모델링 · 모델링 단계',
    dueDate: '2026-08-22',
  },
  {
    id: 'pri-3',
    title: '제안서 최종 교정',
    subtitle: '청년 정책 제안 공모전 · 피드백 반영 단계',
    dueDate: '2026-08-28',
  },
]
