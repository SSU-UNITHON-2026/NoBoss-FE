import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { todoGroups as mockTodoGroups } from '@/mocks/todo'
import type { TodoItem, TodoProjectGroup } from '@/types/todo'

const initialGroups = USE_MOCKS ? mockTodoGroups : []
const QUICK_GROUP_ID = 'quick'

export function TodoListPage() {
  const [groups, setGroups] = useState(initialGroups)
  const [quickTitle, setQuickTitle] = useState('')

  // F-18b: To Do List에서 바로 할 일 추가 — 특정 프로젝트에 속하지 않는 개인 할 일로 즉시 등록
  function addQuickItem(title: string) {
    if (!title.trim()) return
    const newItem: TodoItem = {
      id: `quick-${Date.now()}`,
      projectId: QUICK_GROUP_ID,
      projectLabel: '개인 할 일',
      stepLabel: '바로 추가',
      title: title.trim(),
      ownerLabel: '내 담당',
      dueDate: new Date().toISOString().slice(0, 10),
      done: false,
    }
    setGroups((prev) => {
      const index = prev.findIndex((g) => g.projectId === QUICK_GROUP_ID)
      if (index !== -1) {
        return prev.map((g, i) => (i === index ? { ...g, items: [...g.items, newItem] } : g))
      }
      const quickGroup: TodoProjectGroup = {
        projectId: QUICK_GROUP_ID,
        projectTitle: '개인 할 일',
        courseLabel: '프로젝트 미지정',
        dueDate: newItem.dueDate,
        items: [newItem],
      }
      return [quickGroup, ...prev]
    })
    setQuickTitle('')
  }

  function toggleItem(projectId: string, itemId: string) {
    setGroups((prev) =>
      prev.map((group) =>
        group.projectId !== projectId
          ? group
          : {
              ...group,
              items: [...group.items]
                .map((item) => (item.id === itemId ? { ...item, done: !item.done } : item))
                .sort((a, b) => Number(a.done) - Number(b.done)),
            },
      ),
    )
  }

  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const remaining = allItems.filter((item) => !item.done)
  const completed = allItems.filter((item) => item.done)
  const nearestDue = remaining
    .map((item) => item.dueDate)
    .sort()
    .at(0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">To Do List</h1>
      <p className="mt-1 text-sm text-ink-600">내가 맡은 할 일만 모았습니다. 완료 처리는 직접 하고, 언제든 되돌릴 수 있습니다.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="남은 내 할 일" value={`${remaining.length}건`} />
        <StatCard label="가장 급한 기한" value={nearestDue ? formatDday(nearestDue) : '-'} />
        <StatCard label="완료" value={`${completed.length}건`} />
      </div>

      <div className="mt-6 flex gap-2">
        <Input
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addQuickItem(quickTitle)
          }}
          placeholder="바로 할 일 추가 (예: 회의록 정리)"
          className="flex-1"
        />
        <Button variant="secondary" onClick={() => addQuickItem(quickTitle)} disabled={!quickTitle.trim()}>
          추가
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {groups.length === 0 ? (
          <Card className="text-center text-sm text-ink-600">아직 할 일이 없습니다.</Card>
        ) : (
          groups.map((group) => (
          <div key={group.projectId}>
            <div className="flex items-baseline justify-between border-b border-surface-border pb-2">
              <p className="text-sm">
                <span className="font-semibold text-ink-900">{group.projectTitle}</span>{' '}
                <span className="text-ink-600">
                  {group.courseLabel} · {formatDday(group.dueDate)}
                </span>
              </p>
              <span className="text-sm text-ink-600">
                {group.items.every((i) => i.done)
                  ? '남은 할 일 없음'
                  : `남은 ${group.items.filter((i) => !i.done).length}건`}
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-2.5">
              {group.items.map((item) => (
                <TodoRow key={item.id} item={item} onToggle={() => toggleItem(group.projectId, item.id)} />
              ))}
            </ul>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

function TodoRow({ item, onToggle }: { item: TodoItem; onToggle: () => void }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-brand-500/40 bg-brand-50/40 px-4 py-3">
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-brand-500"
      />
      <div className="flex-1">
        <p className={item.done ? 'text-ink-400 line-through' : 'font-medium text-ink-900'}>{item.title}</p>
        <p className="mt-0.5 text-sm text-ink-600">
          {item.projectLabel} · {item.stepLabel} · {item.ownerLabel}
        </p>
      </div>
      <Badge tone={item.done ? 'neutral' : 'brand'}>{item.done ? '완료' : formatDday(item.dueDate)}</Badge>
    </li>
  )
}
