import type { TodoProjectGroup } from '@/types/todo'

export const todoGroups: TodoProjectGroup[] = [
  {
    projectId: 'p-bias',
    projectTitle: '학습 데이터 편향 사례 분석',
    courseLabel: '데이터윤리 세미나 · 데이터윤리 팀',
    dueDate: '2026-10-01',
    items: [
      {
        id: 'todo-5',
        projectId: 'p-bias',
        projectLabel: '데이터윤리 세미나',
        stepLabel: '리서치 단계',
        title: '편향 사례 3건 정리',
        ownerLabel: '내 담당',
        dueDate: '2026-09-30',
        done: false,
      },
      {
        id: 'todo-6',
        projectId: 'p-bias',
        projectLabel: '데이터윤리 세미나',
        stepLabel: '초안 단계',
        title: '토론 발제문 작성',
        ownerLabel: '내 담당',
        dueDate: '2026-10-06',
        done: false,
      },
    ],
  },
  {
    projectId: 'p-uxreport',
    projectTitle: 'UX 리서치 방법론 보고서',
    courseLabel: '전공 세미나 · UX 리서치 팀',
    dueDate: '2026-08-20',
    items: [
      {
        id: 'todo-7',
        projectId: 'p-uxreport',
        projectLabel: '전공 세미나',
        stepLabel: '최종본 단계',
        title: '최종 보고서 제출',
        ownerLabel: '내 담당',
        dueDate: '2026-08-20',
        done: true,
        submission: {
          id: 'sub-todo-7',
          subtaskId: 'todo-7',
          memberId: 'me',
          fileUrl: 'https://drive.example.com/final-report.pdf',
          note: '최종 보고서 PDF 업로드 완료.',
          submittedAt: '2026-08-20T10:05:00+09:00',
        },
      },
    ],
  },
]
