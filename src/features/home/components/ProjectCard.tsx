import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatDday } from '@/lib/date'
import type { TeamProjectSummary } from '@/types/team'

const statusBadge: Record<TeamProjectSummary['status'], { label: string; tone: 'danger' | 'neutral' }> = {
  delayed: { label: '지연 위험', tone: 'danger' },
  'in-progress': { label: '진행 중', tone: 'neutral' },
  done: { label: '완료', tone: 'neutral' },
}

export function ProjectCard({ project }: { project: TeamProjectSummary }) {
  const badge = statusBadge[project.status]

  return (
    <Link to={`/team/${project.id}`}>
      <Card className="transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-ink-900">{project.title}</p>
            <p className="mt-0.5 text-sm text-ink-600">{project.courseName}</p>
          </div>
          <Badge tone={badge.tone}>
            {badge.label}
            {project.status === 'delayed' ? ` ${project.delayedCount}건` : ''}
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-8">
          <div>
            <p className="text-xs text-ink-600">마감</p>
            <p className="text-lg font-bold text-ink-900">{formatDday(project.dueDate)}</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-600">진행률</span>
              <span className="font-semibold text-ink-900">{project.progressPercent}%</span>
            </div>
            <ProgressBar percent={project.progressPercent} className="mt-1.5" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
