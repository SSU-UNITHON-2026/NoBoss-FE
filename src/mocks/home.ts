import type { PriorityItem } from '@/types/home'

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
    dueDate: '2026-08-24',
  },
  {
    id: 'pri-3',
    title: '제안서 최종 교정',
    subtitle: '청년 정책 제안 공모전 · 최종본 단계',
    dueDate: '2026-08-28',
  },
]
