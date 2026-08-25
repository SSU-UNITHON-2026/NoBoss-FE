import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProjects } from '@/api/project'
import { getTaskRisks, getTasks } from '@/api/tasks'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Input'
import { Tag } from '@/components/ui/Tag'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { getSessionByCode } from '@/lib/inviteSessionStore'
import { getPreferredTasks } from '@/lib/profileStore'
import { ownerNamesFromTasks } from '@/lib/taskMapping'
import { priorityItems as mockPriorityItems } from '@/mocks/home'
import { teamProjectSummaries as mockTeamProjectSummaries } from '@/mocks/project'
import { currentUser as mockCurrentUser } from '@/mocks/user'
import type { TeamProjectSummary } from '@/types/team'
import { ProjectCard } from './ProjectCard'

const priorityItems = USE_MOCKS ? mockPriorityItems : []
// F-03에서 저장한 선호 업무 태그를 그대로 보여준다 — mock 모드에서는 저장된 값이 없으면 데모 값을 쓴다
const myPreferredTasks = getPreferredTasks(USE_MOCKS ? mockCurrentUser.preferredTasks : [])

export function HomePage() {
  const navigate = useNavigate()
  const [backendSummaries, setBackendSummaries] = useState<TeamProjectSummary[]>([])
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState<string | null>(null)

  // 실서버에 있는 모든 프로젝트를 홈 목록에 노출한다 — 더 이상 단일 데모 프로젝트만 보여주지 않는다
  useEffect(() => {
    let cancelled = false
    getProjects()
      .then(async (data) => {
        const summaries = await Promise.all(
          data.projects.map(async (project) => {
            const [tasksData, risksData] = await Promise.all([getTasks(project.id), getTaskRisks(project.id)])
            const totalCount = tasksData.tasks.length
            const completedCount = tasksData.tasks.filter((t) => t.done).length
            const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)
            const delayedCount = risksData.risks.length
            const memberCount = ownerNamesFromTasks(tasksData.tasks).length
            const summary: TeamProjectSummary = {
              id: String(project.id),
              title: project.projectTopic || project.teamName,
              courseName: `${project.subjectName} · ${project.teamName}`,
              memberCount,
              dueDate: project.deadline,
              progressPercent,
              completedCount,
              totalCount,
              delayedCount,
              status: delayedCount > 0 ? 'delayed' : progressPercent >= 100 ? 'done' : 'in-progress',
            }
            return summary
          }),
        )
        if (!cancelled) setBackendSummaries(summaries)
      })
      .catch(() => {
        // 실서버 연결 실패 시 조용히 생략 — 홈 화면 전체를 막지 않는다
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allProjectSummaries = [...backendSummaries, ...(USE_MOCKS ? mockTeamProjectSummaries : [])]

  // F-08: 초대 코드로 진행 중인 팀 생성 세션에 합류한다 — 백엔드 초대 API가 없어
  // localStorage에 저장된 세션(inviteSessionStore)을 코드로 찾아 이어서 들어간다.
  function handleJoin() {
    const session = getSessionByCode(joinCode)
    if (!session) {
      setJoinError('유효하지 않은 초대 코드입니다')
      return
    }
    navigate('/team/new', { state: { joinCode: session.code } })
  }

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
          {allProjectSummaries.length === 0 ? (
            <Card className="text-center text-sm text-ink-600">
              참여 중인 팀프로젝트가 없습니다. "새 팀프로젝트 만들기"로 시작하세요.
            </Card>
          ) : (
            allProjectSummaries.map((project) => <ProjectCard key={project.id} project={project} />)
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <p className="font-semibold text-ink-900">초대 코드로 참가하기</p>
          <div className="mt-3 flex flex-col gap-2">
            <Field label="초대 코드">
              <Input
                placeholder="NB-XXXX-XXXX"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value)
                  setJoinError(null)
                }}
              />
            </Field>
            {joinError ? <p className="text-sm text-danger-600">{joinError}</p> : null}
            <Button variant="secondary" className="mt-1" disabled={!joinCode.trim()} onClick={handleJoin}>
              참가하기
            </Button>
          </div>
        </Card>

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
