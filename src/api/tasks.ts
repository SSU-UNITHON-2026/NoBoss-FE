import { http } from '@/lib/http'
import type { DelayAlert } from '@/types/nudge'
import type { Subtask } from '@/types/task'

// GET /api/v1/tasks
export const getTasks = () => http.get<Subtask[]>('/tasks')

// PATCH /api/v1/tasks/{taskId}/done
export const markTaskDone = (taskId: string) => http.patch<Subtask>(`/tasks/${taskId}/done`)

// GET /api/v1/tasks/risks
export const getTaskRisks = () => http.get<DelayAlert[]>('/tasks/risks')
