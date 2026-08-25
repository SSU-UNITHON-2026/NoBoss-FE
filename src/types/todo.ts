export interface TodoItem {
  id: string
  projectId: string
  projectLabel: string
  stepLabel: string
  title: string
  ownerLabel: '내 담당' | '공동 할 일'
  dueDate: string
  done: boolean
}

export interface TodoProjectGroup {
  projectId: string
  projectTitle: string
  courseLabel: string
  dueDate: string
  items: TodoItem[]
}
