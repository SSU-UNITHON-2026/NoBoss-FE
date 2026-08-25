import { useMemo, useState, type ChangeEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { formatDday } from '@/lib/date'
import { USE_MOCKS } from '@/lib/env'
import { todoGroups as mockTodoGroups } from '@/mocks/todo'
import type { Submission } from '@/types/task'
import type { TodoItem, TodoProjectGroup } from '@/types/todo'

const initialGroups = USE_MOCKS ? mockTodoGroups : []
const QUICK_GROUP_ID = 'quick'
const CURRENT_USER_ID = 'me'

interface SubmissionTarget {
  projectId: string
  item: TodoItem
}

export function TodoListPage() {
  const [groups, setGroups] = useState(initialGroups)
  const [quickTitle, setQuickTitle] = useState('')
  const [submissionTarget, setSubmissionTarget] = useState<SubmissionTarget | null>(null)

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

  // F-19: 완료 처리는 산출물(파일/링크) + 한 줄 메모 업로드를 거쳐야 한다 — 체크박스 단순 토글 금지
  function requestComplete(projectId: string, item: TodoItem) {
    if (item.done) {
      undoItem(projectId, item.id)
      return
    }
    setSubmissionTarget({ projectId, item })
  }

  // F-20: 완료 처리 시점에 상태 자동 변경 + 타임스탬프 기록
  function confirmSubmission(payload: { fileUrl?: string; note: string }) {
    if (!submissionTarget) return
    const { projectId, item } = submissionTarget
    const submission: Submission = {
      id: `sub-${Date.now()}`,
      subtaskId: item.id,
      memberId: CURRENT_USER_ID,
      fileUrl: payload.fileUrl,
      note: payload.note,
      submittedAt: new Date().toISOString(),
    }
    setGroups((prev) =>
      prev.map((group) =>
        group.projectId !== projectId
          ? group
          : {
              ...group,
              items: [...group.items]
                .map((i) => (i.id === item.id ? { ...i, done: true, submission } : i))
                .sort((a, b) => Number(a.done) - Number(b.done)),
            },
      ),
    )
    setSubmissionTarget(null)
  }

  function undoItem(projectId: string, itemId: string) {
    setGroups((prev) =>
      prev.map((group) =>
        group.projectId !== projectId
          ? group
          : {
              ...group,
              items: [...group.items]
                .map((item) => (item.id === itemId ? { ...item, done: false, submission: undefined } : item))
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
                <TodoRow key={item.id} item={item} onToggle={() => requestComplete(group.projectId, item)} />
              ))}
            </ul>
          </div>
          ))
        )}
      </div>

      {submissionTarget ? (
        <SubmissionModal
          itemTitle={submissionTarget.item.title}
          onCancel={() => setSubmissionTarget(null)}
          onSubmit={confirmSubmission}
        />
      ) : null}
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
        {item.done && item.submission ? (
          <p className="mt-1 text-sm text-ink-600">
            {item.submission.fileUrl ? (
              <a
                href={item.submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand-600 hover:underline"
              >
                산출물 보기
              </a>
            ) : null}
            {item.submission.fileUrl && item.submission.note ? ' · ' : ''}
            {item.submission.note}
          </p>
        ) : null}
      </div>
      <Badge tone={item.done ? 'neutral' : 'brand'}>{item.done ? '완료' : formatDday(item.dueDate)}</Badge>
    </li>
  )
}

function SubmissionModal({
  itemTitle,
  onCancel,
  onSubmit,
}: {
  itemTitle: string
  onCancel: () => void
  onSubmit: (payload: { fileUrl?: string; note: string }) => void
}) {
  const [mode, setMode] = useState<'file' | 'link'>('file')
  const [fileName, setFileName] = useState('')
  const [fileObjectUrl, setFileObjectUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [note, setNote] = useState('')

  const attachment = (mode === 'file' ? fileObjectUrl : linkUrl).trim()
  const canSubmit = attachment !== '' && note.trim() !== ''

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setFileObjectUrl(URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
      <Card className="w-full max-w-md">
        <p className="font-semibold text-ink-900">산출물 업로드</p>
        <p className="mt-1 text-sm text-ink-600">{itemTitle}</p>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant={mode === 'file' ? 'primary' : 'secondary'}
            onClick={() => setMode('file')}
          >
            파일 첨부
          </Button>
          <Button
            type="button"
            variant={mode === 'link' ? 'primary' : 'secondary'}
            onClick={() => setMode('link')}
          >
            링크 첨부
          </Button>
        </div>

        <div className="mt-4">
          {mode === 'file' ? (
            <Field label="파일">
              <input type="file" onChange={handleFileChange} className="text-sm text-ink-600" />
              {fileName ? <p className="mt-1 text-xs text-ink-400">선택됨: {fileName}</p> : null}
            </Field>
          ) : (
            <Field label="링크">
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
            </Field>
          )}
        </div>

        <div className="mt-4">
          <Field label="한 줄 메모">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="이번에 완료한 내용을 한 줄로 남겨주세요"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            취소
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ fileUrl: attachment, note: note.trim() })}
          >
            완료 처리
          </Button>
        </div>
      </Card>
    </div>
  )
}
