export interface PriorityItem {
  id: string
  title: string
  subtitle: string
  dueDate: string
}

export const priorityItems: PriorityItem[] = [
  {
    id: 'pri-1',
    title: '설문 문항 교차 검토',
    subtitle: '온보드 · 공동 할 일',
    dueDate: '2026-09-26',
  },
  {
    id: 'pri-2',
    title: '사용자 인터뷰 5명 진행',
    subtitle: '온보드 · 리서치 단계',
    dueDate: '2026-09-27',
  },
  {
    id: 'pri-3',
    title: '역할 분배안 최종 확인',
    subtitle: '온보드 · 검토 대기 2명',
    dueDate: '2026-09-29',
  },
]
