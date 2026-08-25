import type { DelayAlert } from '@/types/nudge'
import type { RoadmapStep } from '@/types/roadmap'
import type { Team, TeamProjectSummary } from '@/types/team'

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

const deliveryTeam: Team = {
  id: 'p-delivery',
  name: '배달온',
  courseName: '서비스디자인 프로젝트',
  topic: '교내 배달앱 UX 리서치',
  description: '캠퍼스 내 배달 서비스 이용 경험을 조사해 개선 방향을 제안한다.',
  dueDate: '2026-10-15',
  memberCount: 4,
  members: [
    { id: 'me', userId: 'me', name: '나', preferredTasks: ['리서치'], completedTaskCount: 5, status: 'in-progress' },
    {
      id: 'deliv-haeun',
      userId: 'deliv-haeun',
      name: '이하은',
      preferredTasks: ['기획·PM'],
      completedTaskCount: 3,
      status: 'in-progress',
    },
    {
      id: 'deliv-jimin',
      userId: 'deliv-jimin',
      name: '박지민',
      preferredTasks: ['디자인'],
      completedTaskCount: 2,
      status: 'in-progress',
    },
    {
      id: 'deliv-doyun',
      userId: 'deliv-doyun',
      name: '최도윤',
      preferredTasks: ['개발·구현'],
      completedTaskCount: 3,
      status: 'in-progress',
    },
  ],
}

const deliveryRoadmap: RoadmapStep[] = [
  {
    id: 'deliv-step-1',
    order: 1,
    label: '1단계 · 주제 선정',
    dueDate: '2026-08-30',
    status: 'done',
    subtasks: [
      { id: 'deliv-1', taskId: 'deliv-step-1', title: '배달앱 리서치 범위 설정', assigneeId: 'me', dueDate: '2026-08-28', status: 'done' },
      { id: 'deliv-2', taskId: 'deliv-step-1', title: '경쟁 서비스 벤치마킹', assigneeId: 'deliv-haeun', dueDate: '2026-08-30', status: 'done' },
    ],
  },
  {
    id: 'deliv-step-2',
    order: 2,
    label: '2단계 · 리서치',
    dueDate: '2026-09-15',
    status: 'in-progress',
    subtasks: [
      { id: 'deliv-3', taskId: 'deliv-step-2', title: '배달원 인터뷰 3건 진행', assigneeId: 'me', dueDate: '2026-09-05', status: 'done' },
      { id: 'deliv-4', taskId: 'deliv-step-2', title: '학생 이용자 설문 50건 수집', assigneeId: 'deliv-haeun', dueDate: '2026-09-08', status: 'done' },
      { id: 'deliv-5', taskId: 'deliv-step-2', title: '설문 결과 정리', assigneeId: 'deliv-jimin', dueDate: '2026-09-10', status: 'done' },
      { id: 'deliv-6', taskId: 'deliv-step-2', title: '배달앱 사용성 관찰 조사', assigneeId: 'deliv-doyun', dueDate: '2026-09-12', status: 'done' },
      { id: 'deliv-7', taskId: 'deliv-step-2', title: '핵심 페인포인트 도출', assigneeId: 'me', dueDate: '2026-09-14', status: 'done' },
      { id: 'deliv-8', taskId: 'deliv-step-2', title: '경쟁앱 UX 플로우 비교', assigneeId: 'deliv-haeun', dueDate: '2026-09-15', status: 'in-progress' },
    ],
  },
  {
    id: 'deliv-step-3',
    order: 3,
    label: '3단계 · 초안 작성',
    dueDate: '2026-09-30',
    status: 'in-progress',
    subtasks: [
      { id: 'deliv-9', taskId: 'deliv-step-3', title: '정보구조(IA) 설계', assigneeId: 'deliv-jimin', dueDate: '2026-09-20', status: 'done' },
      { id: 'deliv-10', taskId: 'deliv-step-3', title: '주문 플로우 와이어프레임', assigneeId: null, dueDate: '2026-09-25', status: 'done' },
      { id: 'deliv-11', taskId: 'deliv-step-3', title: '핵심 화면 UI 초안', assigneeId: 'deliv-doyun', dueDate: '2026-09-26', status: 'done' },
      { id: 'deliv-12', taskId: 'deliv-step-3', title: '네비게이션 구조 검토', assigneeId: 'deliv-haeun', dueDate: '2026-09-28', status: 'done' },
      { id: 'deliv-13', taskId: 'deliv-step-3', title: '결제 플로우 개선안 초안', assigneeId: 'me', dueDate: '2026-09-30', status: 'in-progress' },
      { id: 'deliv-14', taskId: 'deliv-step-3', title: '리뷰/평점 시스템 개선안', assigneeId: 'deliv-jimin', dueDate: '2026-09-30', status: 'in-progress' },
    ],
  },
  {
    id: 'deliv-step-4',
    order: 4,
    label: '4단계 · 피드백 반영',
    dueDate: '2026-10-10',
    status: 'in-progress',
    subtasks: [
      { id: 'deliv-15', taskId: 'deliv-step-4', title: '사용성 테스트 진행', assigneeId: 'me', dueDate: '2026-10-05', status: 'done' },
      { id: 'deliv-16', taskId: 'deliv-step-4', title: '피드백 반영 수정안', assigneeId: 'deliv-doyun', dueDate: '2026-10-08', status: 'done' },
      { id: 'deliv-17', taskId: 'deliv-step-4', title: '디자인 QA', assigneeId: 'deliv-jimin', dueDate: '2026-10-10', status: 'in-progress' },
      { id: 'deliv-18', taskId: 'deliv-step-4', title: '개발 연동 검토', assigneeId: 'deliv-haeun', dueDate: '2026-10-10', status: 'in-progress' },
    ],
  },
  {
    id: 'deliv-step-5',
    order: 5,
    label: '5단계 · 최종본 제출',
    dueDate: '2026-10-15',
    status: 'upcoming',
    subtasks: [
      { id: 'deliv-19', taskId: 'deliv-step-5', title: '최종 발표자료 제작', assigneeId: 'me', dueDate: '2026-10-15', status: 'pending' },
      { id: 'deliv-20', taskId: 'deliv-step-5', title: '최종 프로토타입 제출', assigneeId: 'deliv-doyun', dueDate: '2026-10-15', status: 'pending' },
    ],
  },
]

const anomalyTeam: Team = {
  id: 'p-anomaly',
  name: '이상감지단',
  courseName: '데이터사이언스 캡스톤',
  topic: '센서 데이터 이상탐지 모델링',
  description: 'IoT 센서 로그에서 이상 패턴을 탐지하는 모델을 개발한다.',
  dueDate: '2026-09-10',
  memberCount: 3,
  members: [
    { id: 'me', userId: 'me', name: '나', preferredTasks: ['데이터 분석'], completedTaskCount: 2, status: 'delayed' },
    {
      id: 'anom-nayeon',
      userId: 'anom-nayeon',
      name: '김나연',
      preferredTasks: ['리서치'],
      completedTaskCount: 2,
      status: 'in-progress',
    },
    {
      id: 'anom-seungwoo',
      userId: 'anom-seungwoo',
      name: '유승우',
      preferredTasks: ['개발·구현'],
      completedTaskCount: 0,
      status: 'delayed',
    },
  ],
}

const anomalyRoadmap: RoadmapStep[] = [
  {
    id: 'anom-step-1',
    order: 1,
    label: '1단계 · 주제 선정',
    dueDate: '2026-08-20',
    status: 'done',
    subtasks: [
      { id: 'anom-1', taskId: 'anom-step-1', title: '문제 정의 및 목표 설정', assigneeId: 'me', dueDate: '2026-08-18', status: 'done' },
      { id: 'anom-2', taskId: 'anom-step-1', title: '관련 논문 리서치', assigneeId: 'anom-nayeon', dueDate: '2026-08-20', status: 'done' },
    ],
  },
  {
    id: 'anom-step-2',
    order: 2,
    label: '2단계 · 전처리',
    dueDate: '2026-08-24',
    status: 'in-progress',
    subtasks: [
      { id: 'anom-3', taskId: 'anom-step-2', title: '센서 로그 결측치 처리', assigneeId: 'anom-seungwoo', dueDate: '2026-08-22', status: 'delayed' },
      { id: 'anom-4', taskId: 'anom-step-2', title: '이상치 라벨링 기준 정의', assigneeId: 'me', dueDate: '2026-08-23', status: 'done' },
      { id: 'anom-5', taskId: 'anom-step-2', title: '데이터 정규화', assigneeId: 'anom-nayeon', dueDate: '2026-08-24', status: 'done' },
    ],
  },
  {
    id: 'anom-step-3',
    order: 3,
    label: '3단계 · 모델링',
    dueDate: '2026-09-02',
    status: 'in-progress',
    subtasks: [
      { id: 'anom-6', taskId: 'anom-step-3', title: '베이스라인 모델 성능 정리', assigneeId: 'me', dueDate: '2026-08-22', status: 'delayed' },
      { id: 'anom-7', taskId: 'anom-step-3', title: '이상탐지 알고리즘 비교', assigneeId: 'anom-nayeon', dueDate: '2026-09-01', status: 'in-progress' },
      { id: 'anom-8', taskId: 'anom-step-3', title: '하이퍼파라미터 튜닝', assigneeId: 'anom-seungwoo', dueDate: '2026-09-02', status: 'pending' },
    ],
  },
  {
    id: 'anom-step-4',
    order: 4,
    label: '4단계 · 피드백 반영',
    dueDate: '2026-09-08',
    status: 'upcoming',
    subtasks: [
      { id: 'anom-9', taskId: 'anom-step-4', title: '중간 발표 리허설', assigneeId: null, dueDate: '2026-09-08', status: 'pending' },
    ],
  },
  {
    id: 'anom-step-5',
    order: 5,
    label: '5단계 · 최종본 제출',
    dueDate: '2026-09-10',
    status: 'upcoming',
    subtasks: [
      { id: 'anom-10', taskId: 'anom-step-5', title: '최종 리포트 및 코드 제출', assigneeId: 'anom-seungwoo', dueDate: '2026-09-10', status: 'pending' },
    ],
  },
]

const anomalyDelayAlerts: DelayAlert[] = [
  { subtaskId: 'anom-3', daysOverdue: 4, suggestReassign: true },
  { subtaskId: 'anom-6', daysOverdue: 4, suggestReassign: true },
]

const policyTeam: Team = {
  id: 'p-policy',
  name: '정책메이커스',
  courseName: '사회혁신 프로젝트',
  topic: '청년 정책 제안 공모전',
  description: '청년 주거 문제 해결을 위한 정책을 제안하고 공모전에 출품한다.',
  dueDate: '2026-08-29',
  memberCount: 5,
  members: [
    { id: 'me', userId: 'me', name: '나', preferredTasks: ['기획·PM'], completedTaskCount: 5, status: 'in-progress' },
    {
      id: 'policy-minjun',
      userId: 'policy-minjun',
      name: '강민준',
      preferredTasks: ['리서치'],
      completedTaskCount: 3,
      status: 'done',
    },
    {
      id: 'policy-yujin',
      userId: 'policy-yujin',
      name: '오유진',
      preferredTasks: ['글쓰기·보고서'],
      completedTaskCount: 3,
      status: 'done',
    },
    {
      id: 'policy-taeho',
      userId: 'policy-taeho',
      name: '임태호',
      preferredTasks: ['데이터 분석'],
      completedTaskCount: 3,
      status: 'done',
    },
    {
      id: 'policy-seoyeon',
      userId: 'policy-seoyeon',
      name: '배서연',
      preferredTasks: ['디자인'],
      completedTaskCount: 2,
      status: 'in-progress',
    },
  ],
}

const policyRoadmap: RoadmapStep[] = [
  {
    id: 'policy-step-1',
    order: 1,
    label: '1단계 · 주제 선정',
    dueDate: '2026-08-10',
    status: 'done',
    subtasks: [
      { id: 'policy-1', taskId: 'policy-step-1', title: '정책 주제 브레인스토밍', assigneeId: 'me', dueDate: '2026-08-08', status: 'done' },
      { id: 'policy-2', taskId: 'policy-step-1', title: '문제 정의서 작성', assigneeId: 'policy-minjun', dueDate: '2026-08-09', status: 'done' },
      { id: 'policy-3', taskId: 'policy-step-1', title: '관련 정책 사례 조사', assigneeId: 'policy-yujin', dueDate: '2026-08-10', status: 'done' },
    ],
  },
  {
    id: 'policy-step-2',
    order: 2,
    label: '2단계 · 리서치',
    dueDate: '2026-08-16',
    status: 'done',
    subtasks: [
      { id: 'policy-4', taskId: 'policy-step-2', title: '설문조사 설계 및 배포', assigneeId: 'policy-taeho', dueDate: '2026-08-13', status: 'done' },
      { id: 'policy-5', taskId: 'policy-step-2', title: '인터뷰 5건 진행', assigneeId: 'policy-seoyeon', dueDate: '2026-08-14', status: 'done' },
      { id: 'policy-6', taskId: 'policy-step-2', title: '통계자료 분석', assigneeId: 'me', dueDate: '2026-08-15', status: 'done' },
      { id: 'policy-7', taskId: 'policy-step-2', title: '정책 벤치마킹 정리', assigneeId: 'policy-minjun', dueDate: '2026-08-16', status: 'done' },
    ],
  },
  {
    id: 'policy-step-3',
    order: 3,
    label: '3단계 · 초안 작성',
    dueDate: '2026-08-21',
    status: 'done',
    subtasks: [
      { id: 'policy-8', taskId: 'policy-step-3', title: '정책 제안서 초안 작성', assigneeId: 'me', dueDate: '2026-08-19', status: 'done' },
      { id: 'policy-9', taskId: 'policy-step-3', title: '예산안 초안 작성', assigneeId: 'policy-yujin', dueDate: '2026-08-20', status: 'done' },
      { id: 'policy-10', taskId: 'policy-step-3', title: '인포그래픽 제작', assigneeId: 'policy-taeho', dueDate: '2026-08-20', status: 'done' },
      { id: 'policy-11', taskId: 'policy-step-3', title: '제안서 디자인 편집', assigneeId: 'policy-seoyeon', dueDate: '2026-08-21', status: 'done' },
    ],
  },
  {
    id: 'policy-step-4',
    order: 4,
    label: '4단계 · 피드백 반영',
    dueDate: '2026-08-28',
    status: 'in-progress',
    subtasks: [
      { id: 'policy-12', taskId: 'policy-step-4', title: '발표 자료 최종본 업로드', assigneeId: 'me', dueDate: '2026-08-25', status: 'done' },
      { id: 'policy-13', taskId: 'policy-step-4', title: '멘토 피드백 반영', assigneeId: 'policy-minjun', dueDate: '2026-08-26', status: 'done' },
      { id: 'policy-14', taskId: 'policy-step-4', title: '발표 리허설', assigneeId: 'policy-yujin', dueDate: '2026-08-27', status: 'done' },
      { id: 'policy-15', taskId: 'policy-step-4', title: '제안서 최종 교정', assigneeId: 'me', dueDate: '2026-08-28', status: 'in-progress' },
    ],
  },
  {
    id: 'policy-step-5',
    order: 5,
    label: '5단계 · 최종본 제출',
    dueDate: '2026-08-29',
    status: 'in-progress',
    subtasks: [
      { id: 'policy-16', taskId: 'policy-step-5', title: '최종 제안서 제출', assigneeId: 'policy-taeho', dueDate: '2026-08-29', status: 'done' },
      { id: 'policy-17', taskId: 'policy-step-5', title: '발표 시연 리허설', assigneeId: 'me', dueDate: '2026-08-29', status: 'pending' },
    ],
  },
]

// /team/{id}로 접속했을 때 실서버 프로젝트가 아니면(숫자 id가 아니면) 여기서 찾아 보여준다.
// ProgressDashboard.tsx 참고.
export const mockTeamDetails: Record<string, { team: Team; roadmap: RoadmapStep[]; delayAlerts: DelayAlert[] }> = {
  'p-delivery': { team: deliveryTeam, roadmap: deliveryRoadmap, delayAlerts: [] },
  'p-anomaly': { team: anomalyTeam, roadmap: anomalyRoadmap, delayAlerts: anomalyDelayAlerts },
  'p-policy': { team: policyTeam, roadmap: policyRoadmap, delayAlerts: [] },
}
