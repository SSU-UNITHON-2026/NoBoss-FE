import { http } from '@/lib/http'
import type {
  TaskCreateRequest,
  TaskDeleteResponse,
  TaskListResponse,
  TaskResponse,
  TaskRiskListResponse,
  TaskUpdateRequest,
} from '@/types/taskApi'

// GET /api/v1/projects/{projectId}/tasks
export const getTasks = (projectId: number) => http.get<TaskListResponse>(`/projects/${projectId}/tasks`)

// POST /api/v1/projects/{projectId}/tasks
export const createTask = (projectId: number, body: TaskCreateRequest) =>
  http.post<TaskResponse>(`/projects/${projectId}/tasks`, body)

// PATCH /api/v1/projects/{projectId}/tasks/{taskId}
export const updateTask = (projectId: number, taskId: number, body: TaskUpdateRequest) =>
  http.patch<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`, body)

// DELETE /api/v1/projects/{projectId}/tasks/{taskId}
export const deleteTask = (projectId: number, taskId: number) =>
  http.delete<TaskDeleteResponse>(`/projects/${projectId}/tasks/${taskId}`)

// PATCH /api/v1/projects/{projectId}/tasks/{taskId}/done
export const markTaskDone = (projectId: number, taskId: number, done: boolean) =>
  http.patch<TaskResponse>(`/projects/${projectId}/tasks/${taskId}/done`, { done })

// GET /api/v1/projects/{projectId}/tasks/risks
export const getTaskRisks = (projectId: number) => http.get<TaskRiskListResponse>(`/projects/${projectId}/tasks/risks`)
