import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { priorityItems as mockPriorityItems } from '@/mocks/home'
import { teamProjectSummaries as mockTeamProjectSummaries } from '@/mocks/project'
import { currentUser as mockCurrentUser } from '@/mocks/user'
import { ProjectCard } from './ProjectCard'

const teamProjectSummaries = USE_MOCKS ? mockTeamProjectSummaries : []
const priorityItems = USE_MOCKS ? mockPriorityItems : []
const myPreferredTasks = USE_MOCKS ? mockCurrentUser.preferredTasks : []

export function HomePage() {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-8">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">내 팀프로젝트</h1>
            <p className="mt-1 text-sm text-ink-600">
              {priorityItems.length > 0 ? `오늘 확인해야 할 항목 ${priorityItems.length}건이 있습니다.` : '아직 진행 중인 팀프로젝트가 없습니다.'}
            </p>
          </div>
          <Link to="/team/new">
            <Button>+ 새 팀프로젝트 만들기</Button>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {teamProjectSummaries.length === 0 ? (
            <Card className="text-center text-sm text-ink-600">
              참여 중인 팀프로젝트가 없습니다. "새 팀프로젝트 만들기"로 시작하세요.
            </Card>
          ) : (
            teamProjectSummaries.map((project) => <ProjectCard key={project.id} project={project} />)
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <p className="font-semibold text-ink-900">우선 확인 항목</p>
          <p className="mt-1 text-sm text-ink-600">일정 조정 신호입니다. 개인 평가와 무관합니다.</p>
          {priorityItems.length === 0 ? (
            <p className="mt-4 text-sm text-ink-400">확인할 항목이 없습니다.</p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-surface-border">
              {priorityItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{item.title}</p>
                    <p className="mt-0.5 text-sm text-ink-600">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-brand-600">{formatDday(item.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="font-semibold text-ink-900">내 선호 역할</p>
          {myPreferredTasks.length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">아직 선호 역할을 설정하지 않았습니다.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {myPreferredTasks.map((tag) => (
                <Tag key={tag} selected disabled className="cursor-default disabled:opacity-100">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          <p className="mt-3 text-sm text-ink-600">저장된 선호 역할은 AI 역할 분배 제안에 활용됩니다.</p>
          <Link to="/profile" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline">
            프로필 수정
          </Link>
        </Card>
      </div>
    </div>
  )
}
