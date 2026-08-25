import { http } from '@/lib/http'
import type { TaskListResponse, TaskResponse, TaskRiskListResponse } from '@/types/taskApi'

// GET /api/v1/tasks
export const getTasks = () => http.get<TaskListResponse>('/tasks')

// PATCH /api/v1/tasks/{taskId}/done
export const markTaskDone = (taskId: number, done: boolean) =>
  http.patch<TaskResponse>(`/tasks/${taskId}/done`, { done })

// GET /api/v1/tasks/risks
export const getTaskRisks = () => http.get<TaskRiskListResponse>('/tasks/risks')
