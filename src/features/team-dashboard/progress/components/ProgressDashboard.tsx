import { useEffect, useMemo, useRef, useState } from 'react'
import { applyMessage, sendMessage } from '@/api/messages'
import { getProject, updateProject } from '@/api/project'
import { createTask, deleteTask, getTasks, getTaskRisks, markTaskDone } from '@/api/tasks'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TeamChatPanel } from '@/features/team-dashboard/chat/components/TeamChatPanel'
import { AI_MENTION, isAiMention } from '@/lib/chat'
import { computeContributions } from '@/lib/contribution'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { mapRisksToDelayAlerts, mapTasksToRoadmap, ownerNamesFromTasks } from '@/lib/taskMapping'
import {
  members as mockMembers,
  onboardChatMessages,
  onboardDelayAlerts,
  onboardRoadmap,
  onboardTeam,
} from '@/mocks/project'
import { currentUser } from '@/mocks/user'
import type { ChatMessage } from '@/types/chat'
import type { DelayAlert } from '@/types/nudge'
import type { ProjectResponse } from '@/types/project'
import type { RoadmapStep } from '@/types/roadmap'
import type { Subtask } from '@/types/task'
import type { TaskResponse } from '@/types/taskApi'
import type { Member } from '@/types/team'
import { DelayBanner } from './DelayBanner'
import { DelayRiskPanel } from './DelayRiskPanel'
import { ParticipantStatusGrid } from './ParticipantStatusGrid'
import { RoadmapStepList } from './RoadmapStepList'

interface ProgressDashboardProps {
  teamId?: string
}

export function ProgressDashboard({ teamId }: ProgressDashboardProps) {
  const isMockOnboard = USE_MOCKS && teamId === 'p-onboard'
  // teamId는 실제 백엔드 프로젝트 id(POST /api/v1/projects로 발급된 숫자)를 그대로 라우트 세그먼트로
  // 쓴다 — 더 이상 단일 데모 프로젝트(구 /team/live)로 고정하지 않고, 어떤 프로젝트든 이 화면에서
  // 실서버 데이터를 그대로 보여준다.
  const projectId = !isMockOnboard && teamId ? Number(teamId) : NaN
  const isBackendProject = Number.isFinite(projectId)
  const [liveProject, setLiveProject] = useState<ProjectResponse | null>(null)
  const [liveTasks, setLiveTasks] = useState<TaskResponse[] | null>(null)
  const [liveRisks, setLiveRisks] = useState<DelayAlert[]>([])
  const [liveError, setLiveError] = useState<string | null>(null)
  const [isEditingPlan, setIsEditingPlan] = useState(false)
  const [planDraft, setPlanDraft] = useState<{
    teamName: string
    subjectName: string
    projectTopic: string
    deadline: string
    description: string
  } | null>(null)
  const [planSaving, setPlanSaving] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)
  const [steps, setSteps] = useState<RoadmapStep[]>(() => (isMockOnboard ? onboardRoadmap : []))

  useEffect(() => {
    if (!isBackendProject) return
    let cancelled = false
    getProject(projectId)
      .then((data) => {
        if (!cancelled) setLiveProject(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setLiveError(err instanceof Error ? err.message : '프로젝트 정보를 불러오지 못했습니다')
      })
    getTasks(projectId)
      .then((data) => {
        if (cancelled) return
        setLiveTasks(data.tasks)
        setSteps(mapTasksToRoadmap(data.tasks))
      })
      .catch((err: unknown) => {
        if (!cancelled) setLiveError(err instanceof Error ? err.message : '할 일 목록을 불러오지 못했습니다')
      })
    getTaskRisks(projectId)
      .then((data) => {
        if (!cancelled) setLiveRisks(mapRisksToDelayAlerts(data.risks))
      })
      .catch((err: unknown) => {
        if (!cancelled) setLiveError(err instanceof Error ? err.message : '지연 위험 정보를 불러오지 못했습니다')
      })
    return () => {
      cancelled = true
    }
  }, [isBackendProject, projectId])

  // 백엔드에 인증/멤버 API가 없어 "나"는 전역적으로 mocks/user.ts의 currentUser로 고정한다
  const currentUserId = isMockOnboard ? 'u-yunseah' : isBackendProject ? currentUser.name : 'me'
  const memberNameById: Record<string, string> = isMockOnboard
    ? Object.fromEntries(mockMembers.map((m) => [m.id, m.name]))
    : isBackendProject && liveTasks
      ? Object.fromEntries(ownerNamesFromTasks(liveTasks).map((name) => [name, name]))
      : { [currentUserId]: '나' }

  const members: Member[] = isMockOnboard
    ? mockMembers
    : isBackendProject && liveTasks
      ? ownerNamesFromTasks(liveTasks).map((name) => ({
          id: name,
          userId: name,
          name,
          preferredTasks: [],
          completedTaskCount: 0,
          status: 'in-progress',
        }))
      : [{ id: currentUserId, userId: currentUserId, name: '나', preferredTasks: [], completedTaskCount: 0, status: 'in-progress' }]

  const delayAlerts: DelayAlert[] = isMockOnboard ? onboardDelayAlerts : isBackendProject ? liveRisks : []
  const initialMessages: ChatMessage[] = isMockOnboard ? onboardChatMessages : []
  const teamInfo: { courseName: string; memberCount: number | null; title: string; dueDate: string | null } =
    isMockOnboard
      ? {
          courseName: onboardTeam.courseName,
          memberCount: onboardTeam.memberCount,
          title: `${onboardTeam.name} — ${onboardTeam.topic}`,
          dueDate: onboardTeam.dueDate,
        }
      : isBackendProject && liveProject
        ? {
            // 백엔드가 아직 인원 수를 내려주지 않는다 — 임의로 채우지 않고 null로 남긴다
            courseName: liveProject.subjectName,
            memberCount: null,
            title: `${liveProject.teamName} — ${liveProject.projectTopic}`,
            dueDate: liveProject.deadline,
          }
        : { courseName: '과목 · 인원 정보 없음', memberCount: 1, title: '프로젝트', dueDate: null }

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  const allSubtasks = useMemo(() => steps.flatMap((s) => s.subtasks), [steps])
  const subtasksById = useMemo(() => Object.fromEntries(allSubtasks.map((t) => [t.id, t])), [allSubtasks])
  const completed = allSubtasks.filter((t) => t.status === 'done').length
  const total = allSubtasks.length
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const activeDelayAlerts = delayAlerts.filter((a) => subtasksById[a.subtaskId]?.status !== 'done')
  const contributions = useMemo(() => computeContributions(steps), [steps])
  const delayRiskPanelRef = useRef<HTMLDivElement>(null)

  function scrollToDelayRiskPanel() {
    delayRiskPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function flipDone(steps: RoadmapStep[], subtaskId: string): RoadmapStep[] {
    return steps.map((step) => ({
      ...step,
      subtasks: step.subtasks.map((task) =>
        task.id === subtaskId ? { ...task, status: task.status === 'done' ? 'in-progress' : 'done' } : task,
      ),
    }))
  }

  function toggleSubtask(subtaskId: string) {
    if (isBackendProject) {
      const wasDone = subtasksById[subtaskId]?.status === 'done'
      setSteps((prev) => flipDone(prev, subtaskId))
      markTaskDone(projectId, Number(subtaskId), !wasDone).catch(() => {
        // 실패하면 낙관적 업데이트를 되돌린다
        setSteps((prev) => flipDone(prev, subtaskId))
      })
      return
    }
    setSteps((prev) => flipDone(prev, subtaskId))
  }

  // F-18: 바로 할 일 추가 — 현재 진행 중 단계(없으면 마지막 단계)에 내 담당으로 즉시 추가
  function addQuickTask(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return

    // 실서버 연동 프로젝트는 진짜 POST /api/v1/projects/{id}/tasks로 업무를 생성한다
    if (isBackendProject) {
      if (steps.length === 0) return
      const targetIndex = steps.findIndex((s) => s.status === 'in-progress')
      const index = targetIndex !== -1 ? targetIndex : steps.length - 1
      const stage = steps[index].order
      const dueDate = steps[index].dueDate || teamInfo.dueDate || new Date().toISOString().slice(0, 10)
      createTask(projectId, { stage, title: trimmed, owner: currentUserId, dueDate })
        .then((created) => {
          setLiveTasks((prev) => {
            const next = [...(prev ?? []), created]
            // mapTasksToRoadmap은 서버 응답만으로 다시 구성하므로 isQuickAdd 플래그가 없다 —
            // 방금 만든 항목에만 수동으로 표시해 삭제 버튼이 뜨도록 한다
            setSteps(
              mapTasksToRoadmap(next).map((step) => ({
                ...step,
                subtasks: step.subtasks.map((st) =>
                  st.id === String(created.id) ? { ...st, isQuickAdd: true } : st,
                ),
              })),
            )
            return next
          })
        })
        .catch(() => {
          // 생성 실패 시 조용히 무시 — 사용자는 입력창이 비워지지 않은 걸로 실패를 알 수 있다
        })
      return
    }

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
      return prev.map((step, i) => (i === index ? { ...step, subtasks: [...step.subtasks, newSubtask] } : step))
    })
  }

  // 바로 할 일 추가로 만든 항목만 삭제 가능 — 원래 로드맵 템플릿에 있던 업무는 삭제 대상이 아니다
  function deleteQuickTask(subtaskId: string) {
    if (isBackendProject) {
      setSteps((prev) => prev.map((step) => ({ ...step, subtasks: step.subtasks.filter((t) => t.id !== subtaskId) })))
      setLiveTasks((prev) => (prev ? prev.filter((t) => String(t.id) !== subtaskId) : prev))
      deleteTask(projectId, Number(subtaskId)).catch(() => {
        // 실패해도 굳이 되돌리지 않는다 — 다음 새로고침에서 실제 서버 상태로 다시 맞춰진다
      })
      return
    }
    setSteps((prev) => prev.map((step) => ({ ...step, subtasks: step.subtasks.filter((t) => t.id !== subtaskId) })))
  }

  function appendAiMessage(text: string, extra?: Partial<ChatMessage>) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: teamId ?? 'unknown', authorId: 'ai', text, sentAt: new Date().toISOString(), ...extra },
    ])
  }

  async function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, teamId: teamId ?? 'unknown', authorId: currentUserId, text, sentAt: new Date().toISOString() },
    ])

    // 실서버 연동 프로젝트는 POST /api/v1/projects/{id}/messages로 실제 AI 응답·변경 제안을 받는다
    if (isBackendProject) {
      try {
        const res = await sendMessage(projectId, text)
        appendAiMessage(res.aiMessage, {
          aiMessageId: res.messageId,
          requiresApproval: res.actionType !== 'NONE' && res.requiresApproval,
        })
      } catch {
        appendAiMessage('AI 응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
      return
    }

    // mock 팀은 @AI로 시작하는 메시지만 AI가 응답한다 — 팀원끼리의 일반 대화는 AI 파이프라인을 타지 않는다
    if (!isAiMention(text)) return
    appendAiMessage('확인했습니다. 요청하신 내용을 처리할게요.')
  }

  // F-17/F-28: AI 제안은 승인해야만 반영된다 — POST /api/v1/projects/{id}/messages/{id}/apply
  async function handleApproveMessage(message: ChatMessage) {
    if (message.aiMessageId == null) return
    try {
      const result = await applyMessage(projectId, message.aiMessageId)
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, applied: true } : m)))

      if (result.project) setLiveProject(result.project)
      if (result.task) {
        const appliedTask = result.task
        setLiveTasks((prev) => {
          const existing = prev ?? []
          const index = existing.findIndex((t) => t.id === appliedTask.id)
          const next = index === -1 ? [...existing, appliedTask] : existing.map((t, i) => (i === index ? appliedTask : t))
          setSteps(mapTasksToRoadmap(next))
          return next
        })
      }
      appendAiMessage('적용했습니다.')
    } catch {
      appendAiMessage('적용에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  function requestReassign() {
    // 실서버 연동 프로젝트는 진짜 POST /api/v1/projects/{id}/messages로 재분배 제안을 요청한다
    if (isBackendProject) {
      void handleSend(`${AI_MENTION} 업무를 재분배해줘`)
      return
    }

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

  // 실서버는 PATCH /api/v1/projects/{id}로 계획(팀명·과목·주제·마감·설명)을 직접 수정할 수 있다
  function openPlanEditor() {
    if (!liveProject) return
    setPlanDraft({
      teamName: liveProject.teamName,
      subjectName: liveProject.subjectName,
      projectTopic: liveProject.projectTopic,
      deadline: liveProject.deadline,
      description: liveProject.description,
    })
    setPlanError(null)
    setIsEditingPlan(true)
  }

  async function savePlanEditor() {
    if (!planDraft) return
    setPlanSaving(true)
    setPlanError(null)
    try {
      const updated = await updateProject(projectId, planDraft)
      setLiveProject(updated)
      setIsEditingPlan(false)
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : '저장에 실패했습니다')
    } finally {
      setPlanSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_360px] gap-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-ink-600">
            {teamInfo.courseName} · {teamInfo.memberCount != null ? `${teamInfo.memberCount}인 팀` : '인원 정보 없음'}
          </p>
          <h1 className="text-2xl font-bold text-ink-900">{teamInfo.title}</h1>
        </div>

        {isBackendProject && !liveProject && !liveError ? (
          <p className="text-sm text-ink-400">실제 서버에서 프로젝트 정보를 불러오는 중…</p>
        ) : null}
        {isBackendProject && liveError ? <p className="text-sm text-danger-600">서버 연결 실패: {liveError}</p> : null}

        <DelayBanner count={activeDelayAlerts.length} onReview={scrollToDelayRiskPanel} />

        <div className="grid grid-cols-3 gap-4">
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

        <ParticipantStatusGrid members={members} contributions={contributions} currentUserId={currentUserId} />

        <RoadmapStepList
          steps={steps}
          currentUserId={currentUserId}
          memberNameById={memberNameById}
          onToggleSubtask={toggleSubtask}
          onQuickAdd={addQuickTask}
          onDeleteSubtask={deleteQuickTask}
        />

        <div ref={delayRiskPanelRef}>
          <DelayRiskPanel
            alerts={activeDelayAlerts}
            subtasksById={subtasksById}
            memberNameById={memberNameById}
            teamId={teamId ?? 'unknown'}
            currentUserId={currentUserId}
            onReviewReassign={requestReassign}
          />
        </div>

        {isEditingPlan && planDraft ? (
          <div className="rounded-lg border border-surface-border p-5">
            <p className="mb-4 font-semibold text-ink-900">계획 수정하기</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="팀명">
                <Input
                  value={planDraft.teamName}
                  onChange={(e) => setPlanDraft((p) => (p ? { ...p, teamName: e.target.value } : p))}
                />
              </Field>
              <Field label="과목명">
                <Input
                  value={planDraft.subjectName}
                  onChange={(e) => setPlanDraft((p) => (p ? { ...p, subjectName: e.target.value } : p))}
                />
              </Field>
              <Field label="프로젝트 주제">
                <Input
                  value={planDraft.projectTopic}
                  onChange={(e) => setPlanDraft((p) => (p ? { ...p, projectTopic: e.target.value } : p))}
                />
              </Field>
              <Field label="마감일">
                <Input
                  type="date"
                  value={planDraft.deadline}
                  onChange={(e) => setPlanDraft((p) => (p ? { ...p, deadline: e.target.value } : p))}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="설명">
                <Input
                  value={planDraft.description}
                  onChange={(e) => setPlanDraft((p) => (p ? { ...p, description: e.target.value } : p))}
                />
              </Field>
            </div>
            {planError ? <p className="mt-3 text-sm text-danger-600">{planError}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditingPlan(false)} disabled={planSaving}>
                취소
              </Button>
              <Button onClick={savePlanEditor} disabled={planSaving}>
                {planSaving ? '저장 중…' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button variant="secondary" onClick={openPlanEditor} disabled={!isBackendProject || !liveProject}>
              계획 수정하기
            </Button>
          </div>
        )}
      </div>

      <TeamChatPanel
        className="sticky top-8 h-[calc(100vh-4rem)]"
        memberCount={teamInfo.memberCount ?? 1}
        messages={messages}
        currentUserId={currentUserId}
        memberNameById={memberNameById}
        quickActions={[{ label: 'AI 재분배 제안 요청', onClick: requestReassign }]}
        onSend={handleSend}
        onApprove={handleApproveMessage}
      />
    </div>
  )
}
