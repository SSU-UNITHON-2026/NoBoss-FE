import type { ProjectResponse } from './project'
import type { TaskResponse } from './taskApi'

export type MessageActionType = 'NONE' | 'TASK_CREATE' | 'TASK_UPDATE' | 'PROJECT_UPDATE'

export interface MessageResponse {
  messageId: number
  aiMessage: string
  actionType: MessageActionType
  requiresApproval: boolean
  /** actionType에 따라 모양이 다른 자유 형식 제안 — 화면에는 aiMessage만 노출하고 승인 시 그대로 적용한다 */
  proposal: Record<string, unknown> | null
}

export interface MessageApplyResponse {
  actionType: MessageActionType
  task?: TaskResponse
  project?: ProjectResponse
}
