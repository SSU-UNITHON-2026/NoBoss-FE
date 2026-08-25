import type { DelayAlert } from '@/types/nudge'
import type { RoadmapStep, RoadmapStepStatus } from '@/types/roadmap'
import type { Subtask } from '@/types/task'
import type { TaskResponse, TaskRiskResponse } from '@/types/taskApi'

const SHARED_OWNER = '공동'

// 백엔드는 로드맵 단계(stage) 메타데이터 없이 Task마다 stage(숫자)+stageName만 내려준다.
// stage 기준으로 그룹핑해 프론트가 기대하는 RoadmapStep[](단계별 subtasks 중첩) 형태로 재구성한다.
export function mapTasksToRoadmap(tasks: TaskResponse[]): RoadmapStep[] {
  const byStage = new Map<number, TaskResponse[]>()
  for (const task of tasks) {
    const group = byStage.get(task.stage) ?? []
    group.push(task)
    byStage.set(task.stage, group)
  }

  return [...byStage.entries()]
    .sort(([a], [b]) => a - b)
    .map(([stage, stageTasks]) => {
      const subtasks: Subtask[] = stageTasks.map((task) => ({
        id: String(task.id),
        taskId: `stage-${stage}`,
        title: task.title,
        // 백엔드에 멤버 id 개념이 없다 — owner 이름 문자열을 그대로 assigneeId로 쓴다
        assigneeId: task.owner === SHARED_OWNER ? null : task.owner,
        dueDate: task.dueDate,
        status: task.done ? 'done' : 'in-progress',
      }))
      const allDone = subtasks.length > 0 && subtasks.every((t) => t.status === 'done')
      const status: RoadmapStepStatus = subtasks.length === 0 ? 'no-task' : allDone ? 'done' : 'in-progress'
      const dueDate = [...stageTasks].map((t) => t.dueDate).sort().at(-1) ?? ''

      return {
        id: `stage-${stage}`,
        order: stage,
        label: stageTasks[0].stageName,
        dueDate,
        status,
        subtasks,
      }
    })
}

// 백엔드에 멤버 목록 API가 없어 Task의 owner 이름에서 참여자 목록을 역추출한다
export function ownerNamesFromTasks(tasks: TaskResponse[]): string[] {
  return [...new Set(tasks.map((t) => t.owner).filter((owner) => owner !== SHARED_OWNER))]
}

// GET /tasks/risks의 daysRemaining은 앱 전역 D-day 표기와 같은 값(남은 일수)이라
// DelayAlert.daysOverdue 필드에 그대로 대입한다 — 필드명과 달리 실제로는 D-day 값으로 렌더링된다
// (DelayRiskPanel의 `기한 D-{alert.daysOverdue}` 참고). suggestReassign은 백엔드가 안 주는 값이라
// 항상 true로 채운다 — 현재 UI 어디에서도 이 값을 실제로 읽지는 않는다.
export function mapRisksToDelayAlerts(risks: TaskRiskResponse[]): DelayAlert[] {
  return risks.map((risk) => ({
    subtaskId: String(risk.taskId),
    daysOverdue: risk.daysRemaining,
    suggestReassign: true,
  }))
}
