import { useEffect, useMemo, useState } from 'react'
import { getProject } from '@/api/project'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import { isAiMention } from '@/lib/chat'
import { computeContributions } from '@/lib/contribution'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { getTeam, updateRoadmap } from '@/lib/teamStore'
import {
  members as mockMembers,
  onboardChatMessages,
  onboardDelayAlerts,
  onboardRoadmap,
  onboardTeam,
} from '@/mocks/project'
import type { ChatMessage } from '@/types/chat'
import type { DelayAlert } from '@/types/nudge'
import type { ProjectResponse } from '@/types/project'
import type { RoadmapStep } from '@/types/roadmap'
import type { Subtask } from '@/types/task'
import type { Member } from '@/types/team'
import { DelayRiskPanel } from './DelayRiskPanel'
import { ParticipantStatusGrid } from './ParticipantStatusGrid'
import { RoadmapStepList } from './RoadmapStepList'

interface ProgressDashboardProps {
  teamId?: string
}

export function ProgressDashboard({ teamId }: ProgressDashboardProps) {
  const storedRecord = teamId ? getTeam(teamId) : undefined
  const isStored = Boolean(storedRecord)
  const isMockOnboard = !storedRecord && USE_MOCKS && teamId === 'p-onboard'
  // teamId === 'live'는 백엔드에 실제로 떠 있는 단일 데모 프로젝트(GET /api/v1/project)를 그대로 보여준다.
  // 백엔드가 아직 멀티 팀을 지원하지 않아 임시로 이 경로로만 접근한다.
  const isLiveBackend = !storedRecord && teamId === 'live'
  const [liveProject, setLiveProject] = useState<ProjectResponse | null>(null)
  const [liveError, setLiveError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLiveBackend) return
    let cancelled = false
    getProject()
      .then((data) => {
        if (!cancelled) setLiveProject(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setLiveError(err instanceof Error ? err.message : '프로젝트 정보를 불러오지 못했습니다')
      })
    return () => {
      cancelled = true
    }
  }, [isLiveBackend])

  const currentUserId = isMockOnboard ? 'u-yunseah' : 'me'
  const memberNameById: Record<string, string> = isMockOnboard
    ? Object.fromEntries(mockMembers.map((m) => [m.id, m.name]))
    : storedRecord
      ? Object.fromEntries(storedRecord.team.members.map((m) => [m.id, m.name]))
      : { [currentUserId]: '나' }

  const members: Member[] = isMockOnboard
    ? mockMembers
    : storedRecord
      ? storedRecord.team.members
      : [{ id: currentUserId, userId: currentUserId, name: '나', preferredTasks: [], completedTaskCount: 0, status: 'in-progress' }]

  const initialSteps: RoadmapStep[] = storedRecord ? storedRecord.roadmap : isMockOnboard ? onboardRoadmap : []
  const delayAlerts: DelayAlert[] = isMockOnboard ? onboardDelayAlerts : []
  const initialMessages: ChatMessage[] = isMockOnboard ? onboardChatMessages : []
  const teamInfo: { courseName: string; memberCount: number | null; title: string; dueDate: string | null } =
    storedRecord
      ? {
          courseName: storedRecord.team.courseName,
          memberCount: storedRecord.team.memberCount,
          title: `${storedRecord.team.name} — ${storedRecord.team.topic}`,
          dueDate: storedRecord.team.dueDate,
        }
      : isMockOnboard
        ? {
            courseName: onboardTeam.courseName,
            memberCount: onboardTeam.memberCount,
            title: `${onboardTeam.name} — ${onboardTeam.topic}`,
            dueDate: onboardTeam.dueDate,
          }
        : isLiveBackend && liveProject
          ? {
              // 백엔드가 아직 인원 수를 내려주지 않는다 — 임의로 채우지 않고 null로 남긴다
              courseName: liveProject.subjectName,
              memberCount: null,
              title: `${liveProject.teamName} — ${liveProject.projectTopic}`,
              dueDate: liveProject.deadline,
            }
          : { courseName: '과목 · 인원 정보 없음', memberCount: 1, title: '프로젝트', dueDate: null }

  const [steps, setSteps] = useState<RoadmapStep[]>(initialSteps)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  const allSubtasks = useMemo(() => steps.flatMap((s) => s.subtasks), [steps])
  const subtasksById = useMemo(() => Object.fromEntries(allSubtasks.map((t) => [t.id, t])), [allSubtasks])
  const completed = allSubtasks.filter((t) => t.status === 'done').length
  const total = allSubtasks.length
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const activeDelayAlerts = delayAlerts.filter((a) => subtasksById[a.subtaskId]?.status !== 'done')
  const contributions = useMemo(() => computeContributions(steps), [steps])

  function toggleSubtask(subtaskId: string) {
    setSteps((prev) => {
      const next: RoadmapStep[] = prev.map((step) => ({
        ...step,
        subtasks: step.subtasks.map((task) =>
          task.id === subtaskId ? { ...task, status: task.status === 'done' ? 'in-progress' : 'done' } : task,
        ),
      }))
      if (isStored && teamId) updateRoadmap(teamId, next)
      return next
    })
  }

  // F-18: 바로 할 일 추가 — 현재 진행 중 단계(없으면 마지막 단계)에 내 담당으로 즉시 추가
  function addQuickTask(title: string) {
    if (!title.trim()) return
    setSteps((prev) => {
      if (prev.length === 0) return prev
      const targetIndex = prev.findIndex((s) => s.status === 'in-progress')
      const index = targetIndex !== -1 ? targetIndex : prev.length - 1
      const newSubtask: Subtask = {
        id: `quick-${Date.now()}`,
        taskId: prev[index].id,
        title: title.trim(),
        assigneeId: currentUserId,
        dueDate: prev[index].dueDate,
        status: 'in-progress',
        isQuickAdd: true,
      }
      const next: RoadmapStep[] = prev.map((step, i) =>
        i === index ? { ...step, subtasks: [...step.subtasks, newSubtask] } : step,
      )
      if (isStored && teamId) updateRoadmap(teamId, next)
      return next
    })
  }

  // @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
  function handleSend(text: string) {
    setMessages((prev) => {
      const next = [
        ...prev,
        { id: `local-${prev.length}`, teamId: teamId ?? 'unknown', authorId: currentUserId, text, sentAt: new Date().toISOString() },
      ]
      if (!isAiMention(text)) return next
      return [
        ...next,
        {
          id: `local-${prev.length + 1}`,
          teamId: teamId ?? 'unknown',
          authorId: 'ai',
          text: '확인했습니다. 요청하신 내용을 처리할게요.',
          sentAt: new Date().toISOString(),
        },
      ]
    })
  }

  function requestReassign() {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        teamId: teamId ?? 'unknown',
        authorId: 'ai',
        text: '재분배 제안을 준비하고 있습니다. 잠시만 기다려 주세요.',
        sentAt: new Date().toISOString(),
      },
    ])
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-600">
            {teamInfo.courseName} · {teamInfo.memberCount != null ? `${teamInfo.memberCount}인 팀` : '인원 정보 없음'}
          </p>
          <h1 className="text-2xl font-bold text-ink-900">{teamInfo.title}</h1>
        </div>
        <Button variant="secondary">계획 수정하기</Button>
      </div>

      {isLiveBackend && !liveProject && !liveError ? (
        <p className="mt-2 text-sm text-ink-400">실제 서버에서 프로젝트 정보를 불러오는 중…</p>
      ) : null}
      {isLiveBackend && liveError ? (
        <p className="mt-2 text-sm text-danger-600">서버 연결 실패: {liveError}</p>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard
          label="최종 마감까지"
          value={teamInfo.dueDate ? formatDday(teamInfo.dueDate) : '-'}
          hint={teamInfo.dueDate ?? '마감일 없음'}
        />
        <StatCard label="전체 진행률" value={`${progressPercent}%`} hint={`완료 ${completed} / 전체 ${total}`}>
          <ProgressBar percent={progressPercent} className="mt-3" />
        </StatCard>
        <StatCard label="지연 위험" value={`${activeDelayAlerts.length}건`} hint="팀 전체 검토 필요" />
      </div>

      <div className="mt-6">
        <ParticipantStatusGrid members={members} contributions={contributions} currentUserId={currentUserId} />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <RoadmapStepList
            steps={steps}
            currentUserId={currentUserId}
            memberNameById={memberNameById}
            onToggleSubtask={toggleSubtask}
            onQuickAdd={addQuickTask}
          />

          <DelayRiskPanel
            alerts={activeDelayAlerts}
            subtasksById={subtasksById}
            memberNameById={memberNameById}
            teamId={teamId ?? 'unknown'}
            currentUserId={currentUserId}
            onReviewReassign={requestReassign}
          />
        </div>

        <TeamChatPanel
          className="h-full"
          memberCount={teamInfo.memberCount ?? 1}
          messages={messages}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          quickActions={[{ label: 'AI 재분배 제안 요청', onClick: requestReassign }]}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
