import type { ChatMessage } from '@/types/chat'
import type { DelayAlert } from '@/types/nudge'
import type { RoadmapStep } from '@/types/roadmap'
import type { Member, Team, TeamProjectSummary } from '@/types/team'

export const members: Member[] = [
  {
    id: 'u-yunseah',
    userId: 'u-yunseah',
    name: '윤세아',
    preferredTasks: ['기획·PM', '리서치'],
    completedTaskCount: 1,
    status: 'delayed',
  },
  {
    id: 'u-jeongharam',
    userId: 'u-jeongharam',
    name: '정하람',
    preferredTasks: ['개발·구현'],
    completedTaskCount: 0,
    status: 'in-progress',
  },
  {
    id: 'u-otaeyun',
    userId: 'u-otaeyun',
    name: '오태윤',
    preferredTasks: ['발표·커뮤니케이션'],
    completedTaskCount: 1,
    status: 'in-progress',
  },
  {
    id: 'u-baesihyun',
    userId: 'u-baesihyun',
    name: '배시현',
    preferredTasks: ['데이터 분석'],
    completedTaskCount: 0,
    status: 'in-progress',
  },
]

export const onboardTeam: Team = {
  id: 'p-onboard',
  name: '온보드',
  courseName: '서비스디자인 캡스톤',
  topic: '캠퍼스 중고거래 앱 UX 개선',
  description: '중고거래 앱의 신뢰 문제를 해결하는 UX 개선안을 제안한다.',
  dueDate: '2026-12-11',
  memberCount: 4,
  members,
}

export const onboardRoadmap: RoadmapStep[] = [
  {
    id: 'step-1',
    order: 1,
    label: '1단계 · 주제 선정',
    dueDate: '2026-09-12',
    status: 'no-task',
    subtasks: [],
  },
  {
    id: 'step-2',
    order: 2,
    label: '2단계 · 리서치',
    dueDate: '2026-10-10',
    status: 'in-progress',
    subtasks: [
      {
        id: 'task-script',
        taskId: 'p-onboard',
        title: '인터뷰 스크립트 확정',
        assigneeId: 'u-yunseah',
        dueDate: '2026-09-20',
        status: 'done',
      },
      {
        id: 'task-interview',
        taskId: 'p-onboard',
        title: '사용자 인터뷰 5명 진행',
        assigneeId: 'u-yunseah',
        dueDate: '2026-09-27',
        status: 'delayed',
      },
      {
        id: 'task-survey',
        taskId: 'p-onboard',
        title: '설문 문항 교차 검토',
        assigneeId: null,
        dueDate: '2026-09-28',
        status: 'delayed',
      },
      {
        id: 'task-competitor',
        taskId: 'p-onboard',
        title: '경쟁 서비스 벤치마킹',
        assigneeId: 'u-jeongharam',
        dueDate: '2026-10-05',
        status: 'in-progress',
      },
    ],
  },
  {
    id: 'step-3',
    order: 3,
    label: '3단계 · 초안 작성',
    dueDate: '2026-11-07',
    status: 'upcoming',
    subtasks: [
      {
        id: 'task-wireframe',
        taskId: 'p-onboard',
        title: '와이어프레임 초안',
        assigneeId: 'u-jeongharam',
        dueDate: '2026-10-25',
        status: 'pending',
      },
      {
        id: 'task-flow',
        taskId: 'p-onboard',
        title: '핵심 플로우 정의',
        assigneeId: 'u-otaeyun',
        dueDate: '2026-10-30',
        status: 'pending',
      },
    ],
  },
  {
    id: 'step-4',
    order: 4,
    label: '4단계 · 피드백 반영',
    dueDate: '2026-11-28',
    status: 'upcoming',
    subtasks: [
      {
        id: 'task-rehearsal',
        taskId: 'p-onboard',
        title: '중간 발표 리허설',
        assigneeId: null,
        dueDate: '2026-11-26',
        status: 'pending',
      },
      {
        id: 'task-revision',
        taskId: 'p-onboard',
        title: '피드백 반영 수정본',
        assigneeId: 'u-baesihyun',
        dueDate: '2026-11-28',
        status: 'pending',
      },
    ],
  },
  {
    id: 'step-5',
    order: 5,
    label: '5단계 · 최종본 제출',
    dueDate: '2026-12-11',
    status: 'no-task',
    subtasks: [],
  },
]

export const onboardDelayAlerts: DelayAlert[] = [
  { subtaskId: 'task-interview', daysOverdue: 2, suggestReassign: true },
  { subtaskId: 'task-survey', daysOverdue: 1, suggestReassign: true },
]

export const onboardChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    teamId: 'p-onboard',
    authorId: 'ai',
    text: '@정하람 리서치 정리 초안 마감이 D-2입니다. 오늘 중 진행 상황을 남겨주세요.',
    sentAt: '2026-09-25T09:00:00+09:00',
  },
  {
    id: 'msg-2',
    teamId: 'p-onboard',
    authorId: 'ai',
    text: '@윤세아 사용자 인터뷰 5명 진행이 D-2, 아직 미완료입니다. 일정 조정이 필요하면 재분배 제안을 확인해 주세요.',
    sentAt: '2026-09-25T09:00:00+09:00',
  },
  {
    id: 'msg-3',
    teamId: 'p-onboard',
    authorId: 'u-otaeyun',
    text: '설문 문항 검토는 제가 나눠 받을 수 있어요.',
    sentAt: '2026-09-25T09:12:00+09:00',
  },
  {
    id: 'msg-4',
    teamId: 'p-onboard',
    authorId: 'ai',
    text: '재분배 제안 초안을 만들었습니다. 설문 문항 검토를 오태윤·배시현으로 나누는 안입니다. 팀원 전원 검토 후 적용됩니다.',
    sentAt: '2026-09-25T09:13:00+09:00',
    proposedAction: {
      type: 'create_task',
      step: 2,
      stepLabel: '2단계 · 리서치',
      title: '설문 문항 교차 검토(분담)',
      assigneeId: 'u-otaeyun',
      assigneeName: '오태윤·배시현',
      dueDate: '2026-09-28',
    },
  },
  {
    id: 'msg-5',
    teamId: 'p-onboard',
    authorId: 'u-yunseah',
    text: '좋아요. 인터뷰는 제가 오늘 2명 마무리할게요.',
    sentAt: '2026-09-25T09:20:00+09:00',
  },
]

export const teamProjectSummaries: TeamProjectSummary[] = [
  {
    id: 'p-onboard',
    title: '캠퍼스 중고거래 앱 UX 개선',
    courseName: '서비스디자인 캡스톤 · 4인 팀',
    memberCount: 4,
    dueDate: '2026-12-11',
    progressPercent: 25,
    completedCount: 2,
    totalCount: 8,
    delayedCount: 2,
    status: 'delayed',
  },
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
