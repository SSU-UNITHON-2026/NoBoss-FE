import type { TeamProjectSummary } from '@/types/team'

export const teamProjectSummaries: TeamProjectSummary[] = [
  {
    id: 'p-bias',
    title: '학습 데이터 편향 사례 분석',
    courseName: '데이터윤리 세미나 · 3인 팀',
    memberCount: 3,
    dueDate: '2026-10-01',
    progressPercent: 41,
    completedCount: 5,
    totalCount: 12,
    delayedCount: 0,
    status: 'in-progress',
  },
  {
    id: 'p-uxreport',
    title: 'UX 리서치 방법론 보고서',
    courseName: '전공 세미나 · 2인 팀',
    memberCount: 2,
    dueDate: '2026-08-20',
    progressPercent: 100,
    completedCount: 6,
    totalCount: 6,
    delayedCount: 0,
    status: 'done',
  },
]
