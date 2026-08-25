/** GET /api/v1/tasks, PATCH /api/v1/tasks/{taskId}/done 실제 백엔드 응답 스키마 (Swagger 기준) */
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

/** GET /api/v1/tasks/risks 실제 백엔드 응답 스키마 */
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
