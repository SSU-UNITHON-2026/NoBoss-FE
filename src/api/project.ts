import { http } from '@/lib/http'
import type { Team } from '@/types/team'

// GET /api/v1/project
export const getProject = () => http.get<Team>('/project')
