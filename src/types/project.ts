/** GET /api/v1/project 실제 백엔드 응답 스키마 (Swagger 기준) */
export interface ProjectResponse {
  id: number
  teamName: string
  subjectName: string
  projectTopic: string
  deadline: string
  description: string
}
