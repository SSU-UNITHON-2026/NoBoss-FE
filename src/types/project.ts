/** GET /api/v1/projects/{id} 실제 백엔드 응답 스키마 (Swagger 기준) */
export interface ProjectResponse {
  id: number
  teamName: string
  subjectName: string
  projectTopic: string
  deadline: string
  description: string
}

export interface ProjectListResponse {
  projects: ProjectResponse[]
}

/** POST /api/v1/projects 요청 바디 — teamName/subjectName/projectTopic/deadline/description 전부 필수 */
export interface ProjectCreateRequest {
  teamName: string
  subjectName: string
  projectTopic: string
  deadline: string
  description: string
}

/** PATCH /api/v1/projects/{id} 요청 바디 — 전 필드 선택 */
export type ProjectUpdateRequest = Partial<ProjectCreateRequest>
