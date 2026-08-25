import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDday } from '@/lib/date'
import { cn } from '@/lib/cn'
import type { RoadmapStep, RoadmapStepStatus } from '@/types/roadmap'
import type { Subtask } from '@/types/task'

const stepStatusLabel: Record<RoadmapStepStatus, string> = {
  'no-task': '할 일 없음',
  'in-progress': '진행 중',
  upcoming: '예정',
  done: '완료',
}

interface RoadmapStepListProps {
  steps: RoadmapStep[]
  currentUserId: string
  memberNameById: Record<string, string>
  onToggleSubtask: (subtaskId: string) => void
  onQuickAdd: (title: string) => void
  onDeleteSubtask?: (subtaskId: string) => void
}

export function RoadmapStepList({
  steps,
  currentUserId,
  memberNameById,
  onToggleSubtask,
  onQuickAdd,
  onDeleteSubtask,
}: RoadmapStepListProps) {
  const total = steps.flatMap((s) => s.subtasks).length
  const completed = steps.flatMap((s) => s.subtasks).filter((t) => t.status === 'done').length
  const [quickTitle, setQuickTitle] = useState('')

  // F-18: 바로 할 일 추가 — 제목만 입력하면 현재 진행 중 단계(없으면 마지막 단계)에 내 담당으로 즉시 등록
  function submitQuickAdd() {
    if (!quickTitle.trim()) return
    onQuickAdd(quickTitle)
    setQuickTitle('')
  }

  return (
    <div className="rounded-lg border border-surface-border p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-ink-900">단계별 내 할 일</p>
        <p className="text-sm text-ink-600">
          {completed} / {total} 완료
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitQuickAdd()
          }}
          placeholder="바로 할 일 추가 (예: 참고자료 정리)"
          disabled={steps.length === 0}
          className="flex-1"
        />
        <Button variant="secondary" onClick={submitQuickAdd} disabled={steps.length === 0 || !quickTitle.trim()}>
          추가
        </Button>
      </div>

      {steps.length === 0 ? (
        <p className="mt-4 text-sm text-ink-400">등록된 로드맵이 없습니다.</p>
      ) : (
        <ol className="mt-4 flex flex-col">
          {steps.map((step) => {
          const mine = step.subtasks.filter((t) => t.assigneeId === currentUserId || t.assigneeId === null)
          const others = step.subtasks.filter((t) => t.assigneeId && t.assigneeId !== currentUserId)
          return (
            <li key={step.id} className="flex gap-3 border-l border-surface-border pb-6 pl-4 last:pb-0">
              <span className="-ml-[1.05rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-surface-border bg-white text-xs font-semibold text-ink-600">
                {step.order}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink-900">
                    {step.label} <span className="ml-1 text-sm font-normal text-ink-400">~{step.dueDate.slice(5).replace('-', '.')}</span>
                  </p>
                  <span className="text-sm text-ink-600">{stepStatusLabel[step.status]}</span>
                </div>

                {mine.length === 0 ? <p className="mt-1 text-sm text-ink-400">내 담당 없음</p> : null}

                <ul className="mt-2 flex flex-col gap-2">
                  {mine.map((task) => (
                    <SubtaskRow
                      key={task.id}
                      task={task}
                      ownerLabel={task.assigneeId ? '내 담당' : '공동 할 일'}
                      onToggle={() => onToggleSubtask(task.id)}
                      onDelete={task.isQuickAdd && onDeleteSubtask ? () => onDeleteSubtask(task.id) : undefined}
                    />
                  ))}
                </ul>

                {others.length > 0 ? (
                  <OthersDisclosure tasks={others} memberNameById={memberNameById} onToggle={onToggleSubtask} />
                ) : null}
              </div>
            </li>
          )
          })}
        </ol>
      )}
    </div>
  )
}

function SubtaskRow({
  task,
  ownerLabel,
  onToggle,
  onDelete,
}: {
  task: Subtask
  ownerLabel: string
  onToggle: () => void
  onDelete?: () => void
}) {
  const done = task.status === 'done'
  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-lg border px-3.5 py-2.5',
        task.status === 'delayed' ? 'border-danger-500/50 bg-danger-50/60' : 'border-brand-500/30 bg-brand-50/30',
      )}
    >
      <input type="checkbox" checked={done} onChange={onToggle} className="h-4.5 w-4.5 accent-brand-500" />
      <div className="flex-1">
        <p className={done ? 'text-ink-400 line-through' : 'text-sm font-medium text-ink-900'}>{task.title}</p>
        <p className="text-xs text-ink-600">{ownerLabel}</p>
      </div>
      <Badge tone={done ? 'neutral' : task.status === 'delayed' ? 'danger' : 'brand'}>
        {done ? '완료' : formatDday(task.dueDate)}
      </Badge>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          aria-label="바로 추가한 할 일 삭제"
          className="shrink-0 text-ink-400 hover:text-danger-600"
        >
          ×
        </button>
      ) : null}
    </li>
  )
}

function OthersDisclosure({
  tasks,
  memberNameById,
  onToggle,
}: {
  tasks: Subtask[]
  memberNameById: Record<string, string>
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm text-brand-600 hover:underline">
        팀원 할 일 {tasks.length}건 {open ? '접기' : '보기'} {open ? '▲' : '▼'}
      </button>
      {open ? (
        <ul className="mt-2 flex flex-col gap-2">
          {tasks.map((task) => (
            <SubtaskRow
              key={task.id}
              task={task}
              ownerLabel={memberNameById[task.assigneeId ?? ''] ?? '팀원'}
              onToggle={() => onToggle(task.id)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
