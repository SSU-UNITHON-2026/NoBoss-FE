import type { RoadmapStep } from '@/types/roadmap'
import type { Team, TeamProjectSummary } from '@/types/team'

export interface StoredTeamRecord {
  team: Team
  roadmap: RoadmapStep[]
}

const STORAGE_KEY = 'noboss.teams'

function readAll(): StoredTeamRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredTeamRecord[]) : []
  } catch {
    return []
  }
}

function writeAll(records: StoredTeamRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function listTeams(): StoredTeamRecord[] {
  return readAll()
}

export function getTeam(teamId: string): StoredTeamRecord | undefined {
  return readAll().find((r) => r.team.id === teamId)
}

export function createTeam(team: Team, roadmap: RoadmapStep[]): StoredTeamRecord {
  const record: StoredTeamRecord = { team, roadmap }
  writeAll([...readAll(), record])
  return record
}

export function updateRoadmap(teamId: string, roadmap: RoadmapStep[]) {
  const all = readAll()
  const index = all.findIndex((r) => r.team.id === teamId)
  if (index === -1) return
  all[index] = { ...all[index], roadmap }
  writeAll(all)
}

export function summarizeTeam(record: StoredTeamRecord): TeamProjectSummary {
  const { team, roadmap } = record
  const subtasks = roadmap.flatMap((s) => s.subtasks)
  const completedCount = subtasks.filter((t) => t.status === 'done').length
  const delayedCount = subtasks.filter((t) => t.status === 'delayed').length
  const totalCount = subtasks.length
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return {
    id: team.id,
    title: team.topic || team.name,
    courseName: `${team.courseName} · ${team.memberCount}인 팀`,
    memberCount: team.memberCount,
    dueDate: team.dueDate,
    progressPercent,
    completedCount,
    totalCount,
    delayedCount,
    status: delayedCount > 0 ? 'delayed' : progressPercent >= 100 ? 'done' : 'in-progress',
  }
}
