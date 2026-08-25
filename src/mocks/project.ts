import type { TeamProjectSummary } from '@/types/team'

// 홈 화면 데모용 mock 팀 3개 — 각각 NoBoss의 핵심 강점을 다른 상황에서 보여주도록 설계했다.
// 1) p-delivery: 팀장 없이도 순조롭게 굴러가는 정상 진행 사례
// 2) p-anomaly: 지연 위험을 시스템이 자동으로 잡아내고 재분배를 제안하는 사례 (F-16/F-17)
// 3) p-policy: 마감 직전까지 기여도가 자동 집계되며 막판 스퍼트하는 사례 (F-14/F-20/F-21)
export const teamProjectSummaries: TeamProjectSummary[] = [
  {
    id: 'p-delivery',
    title: '교내 배달앱 UX 리서치',
    courseName: '서비스디자인 프로젝트 · 4인 팀',
    memberCount: 4,
    dueDate: '2026-10-15',
    progressPercent: 65,
    completedCount: 13,
    totalCount: 20,
    delayedCount: 0,
    status: 'in-progress',
  },
  {
    id: 'p-anomaly',
    title: '센서 데이터 이상탐지 모델링',
    courseName: '데이터사이언스 캡스톤 · 3인 팀',
    memberCount: 3,
    dueDate: '2026-09-10',
    progressPercent: 40,
    completedCount: 4,
    totalCount: 10,
    delayedCount: 2,
    status: 'delayed',
  },
  {
    id: 'p-policy',
    title: '청년 정책 제안 공모전',
    courseName: '사회혁신 프로젝트 · 5인 팀',
    memberCount: 5,
    dueDate: '2026-08-29',
    progressPercent: 88,
    completedCount: 15,
    totalCount: 17,
    delayedCount: 0,
    status: 'in-progress',
  },
]
