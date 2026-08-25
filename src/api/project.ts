import { http } from '@/lib/http'
import type { ProjectResponse } from '@/types/project'

// GET /api/v1/project
export const getProject = () => http.get<ProjectResponse>('/project')
