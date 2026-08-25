import type { Submission } from './task'

export interface TodoItem {
  id: string
  projectId: string
  projectLabel: string
  stepLabel: string
  title: string
  ownerLabel: '내 담당' | '공동 할 일'
  dueDate: string
  done: boolean
  /** F-19: 완료 처리 시 첨부한 산출물. 완료된 항목에만 존재한다 */
  submission?: Submission
}

export interface TodoProjectGroup {
  projectId: string
  projectTitle: string
  courseLabel: string
  dueDate: string
  items: TodoItem[]
}
