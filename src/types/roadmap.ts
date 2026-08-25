import type { Subtask } from './task'

export type RoadmapStepStatus = 'no-task' | 'in-progress' | 'upcoming' | 'done'

export interface RoadmapStep {
  id: string
  order: number
  label: string
  dueDate: string
  status: RoadmapStepStatus
  subtasks: Subtask[]
}
