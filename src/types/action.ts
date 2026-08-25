import type { Team } from './team'

/**
 * LLM은 DB를 직접 수정하지 않고 구조화된 Action만 생성한다.
 * 사용자가 승인(POST /messages/{id}/apply)해야 백엔드 Action Executor가 실제로 반영한다.
 */
export interface CreateTaskAction {
  type: 'create_task'
  step: number
  stepLabel: string
  title: string
  assigneeId: string | null
  assigneeName: string
  dueDate: string
}

export interface UpdateDeadlineAction {
  type: 'update_deadline'
  fromDate: string
  toDate: string
}

export interface UpdateTeamInfoAction {
  type: 'update_team_info'
  fields: Partial<Pick<Team, 'name' | 'courseName' | 'topic' | 'description' | 'dueDate' | 'memberCount'>>
}

export type AiAction = CreateTaskAction | UpdateDeadlineAction | UpdateTeamInfoAction
