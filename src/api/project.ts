import { http } from '@/lib/http'
import type { ProjectCreateRequest, ProjectListResponse, ProjectResponse, ProjectUpdateRequest } from '@/types/project'

// GET /api/v1/projects
export const getProjects = () => http.get<ProjectListResponse>('/projects')

// GET /api/v1/projects/{projectId}
export const getProject = (projectId: number) => http.get<ProjectResponse>(`/projects/${projectId}`)

// POST /api/v1/projects
export const createProject = (body: ProjectCreateRequest) => http.post<ProjectResponse>('/projects', body)

// PATCH /api/v1/projects/{projectId}
export const updateProject = (projectId: number, body: ProjectUpdateRequest) =>
  http.patch<ProjectResponse>(`/projects/${projectId}`, body)
