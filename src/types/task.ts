export type TaskTemplateType = 'presentation' | 'development' | 'report'

export type SubtaskStatus = 'pending' | 'in-progress' | 'done' | 'delayed'

export interface Subtask {
  id: string
  taskId: string
  title: string
  assigneeId: string | null
  dueDate: string
  status: SubtaskStatus
  isQuickAdd?: boolean
}

export interface Task {
  id: string
  teamId: string
  title: string
  templateType: TaskTemplateType
  dueDate: string
  subtasks: Subtask[]
}

export interface Submission {
  id: string
  subtaskId: string
  memberId: string
  fileUrl?: string
  note: string
  submittedAt: string
}
