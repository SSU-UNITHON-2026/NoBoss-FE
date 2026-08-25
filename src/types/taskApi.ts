/** GET /api/v1/projects/{projectId}/tasks 실제 백엔드 응답 스키마 (Swagger 기준) */
export interface TaskResponse {
  id: number
  stage: number
  stageName: string
  title: string
  owner: string
  dueDate: string
  done: boolean
}

export interface TaskListResponse {
  tasks: TaskResponse[]
}

export interface TaskDoneUpdateRequest {
  done: boolean
}

/** POST /api/v1/projects/{projectId}/tasks 요청 바디 — 전 필드 필수 */
export interface TaskCreateRequest {
  stage: number
  title: string
  owner: string
  dueDate: string
}

/** PATCH /api/v1/projects/{projectId}/tasks/{taskId} 요청 바디 — 전 필드 선택 */
export type TaskUpdateRequest = Partial<TaskCreateRequest>

/** DELETE /api/v1/projects/{projectId}/tasks/{taskId} 응답 */
export interface TaskDeleteResponse {
  taskId: number
}

/** GET /api/v1/projects/{projectId}/tasks/risks 실제 백엔드 응답 스키마 */
export interface TaskRiskResponse {
  taskId: number
  stage: number
  stageName: string
  taskTitle: string
  owner: string
  dueDate: string
  daysRemaining: number
}

export interface TaskRiskListResponse {
  risks: TaskRiskResponse[]
}
