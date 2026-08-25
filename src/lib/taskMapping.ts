import type { RoadmapStep, RoadmapStepStatus } from '@/types/roadmap'
import type { Subtask } from '@/types/task'
import type { TaskResponse } from '@/types/taskApi'

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
