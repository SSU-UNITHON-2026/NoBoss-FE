import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { AI_MENTION, isAiMention, splitAiMention, stripAiMention } from '@/lib/chat'
import { cn } from '@/lib/cn'
import type { ChatMessage } from '@/types/chat'

interface QuickAction {
  label: string
  onClick: () => void
}

// 메시지 안의 "@AI" 토큰만 배지로 강조하고 나머지 문장은 그대로 렌더링한다 — 문장 전체를 강조하지 않는다.
function renderMessageText(text: string) {
  const split = splitAiMention(text)
  if (!split) return text
  return (
    <>
      <span className="mr-1.5 rounded bg-brand-500 px-1.5 py-0.5 align-middle text-xs font-semibold text-white">
        {split.mention}
      </span>
      {split.rest}
    </>
  )
}

interface TeamChatPanelProps {
  title?: string
  memberCount: number
  messages: ChatMessage[]
  currentUserId: string
  memberNameById: Record<string, string>
  quickActions?: QuickAction[]
  onSend?: (text: string) => void
  onApprove?: (message: ChatMessage) => void
  className?: string
}

export function TeamChatPanel({
  title = '팀 채팅방',
  memberCount,
  messages,
  currentUserId,
  memberNameById,
  quickActions,
  onSend,
  onApprove,
  className,
}: TeamChatPanelProps) {
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 새 메시지(특히 AI 응답처럼 비동기로 도착하는 메시지)가 오면 항상 최신 메시지가 보이도록 스크롤한다
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])
  const hasAiMention = isAiMention(draft)

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft('')
  }

  // 버튼을 누르면 "@AI " 멘션을 자동으로 붙였다 뗐다 하는 토글 — 사람끼리의 대화와 AI에게
  // 내리는 명령을 입력 시점부터 명확히 구분하기 위함
  function toggleAiMention() {
    setDraft((d) => (isAiMention(d) ? stripAiMention(d) : `${AI_MENTION} ${d.trimStart()}`))
  }

  return (
    <div className={cn('flex flex-col rounded-lg border border-surface-border', className)}>
      <div className="flex items-center justify-between border-b border-surface-border px-5 py-3">
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-sm text-ink-600">{memberCount}명 · NOBOSS AI 참여 중</p>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => {
          const isAi = message.authorId === 'ai'
          const isMe = message.authorId === currentUserId
          const author = isAi ? 'NOBOSS AI' : isMe ? `나 (${memberNameById[message.authorId] ?? ''})` : memberNameById[message.authorId] ?? message.authorId

          return (
            <li key={message.id}>
              <p className="mb-1 flex items-center gap-1.5 text-xs text-ink-400">
                {isAi ? (
                  <span className="rounded border border-brand-500 px-1 text-[10px] font-semibold text-brand-600">
                    AI
                  </span>
                ) : null}
                <span>{author}</span>
                <span>·</span>
                <span>
                  {new Date(message.sentAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
              <p
                className={cn(
                  'max-w-[85%] rounded-lg border px-3.5 py-2.5 text-sm',
                  isAi
                    ? 'border-brand-500/40 bg-brand-50/60 text-ink-900'
                    : 'border-surface-border bg-surface-muted text-ink-900',
                )}
              >
                {renderMessageText(message.text)}
              </p>
              {isAi && message.requiresApproval && !message.applied ? (
                <button
                  type="button"
                  onClick={() => onApprove?.(message)}
                  className="mt-1.5 rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50/60"
                >
                  확인하고 적용
                </button>
              ) : null}
              {isAi && message.requiresApproval && message.applied ? (
                <p className="mt-1.5 text-xs font-medium text-brand-600">적용됨</p>
              ) : null}
            </li>
          )
        })}
        <div ref={bottomRef} />
      </ul>

      {quickActions?.length ? (
        <div className="flex gap-2 border-t border-surface-border px-5 py-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="rounded-lg border border-surface-border px-3 py-1.5 text-sm text-ink-600 hover:bg-surface-muted"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2 border-t border-surface-border px-5 py-3">
        <button
          type="button"
          onClick={toggleAiMention}
          aria-pressed={hasAiMention}
          className={cn(
            'shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
            hasAiMention
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-surface-border text-ink-600 hover:bg-surface-muted',
          )}
        >
          {AI_MENTION}
        </button>
        <input
          className="flex-1 rounded-lg border border-surface-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white"
          placeholder="메시지 입력"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // 한글 등 조합형 입력 중 Enter를 누르면 조합이 끝나기 전에 전송돼 마지막 글자가
            // 인풋에 남았다가 다시 나타나는 문제가 있었다 — 조합 중(isComposing)에는 무시한다.
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
          }}
        />
        <Button type="button" onClick={handleSend} aria-label="전송" className="shrink-0 px-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4.5 w-4.5"
            aria-hidden="true"
          >
            <path d="M2.94 2.06a.75.75 0 0 0-.94.98l2.62 6.72a.25.25 0 0 0 .23.16h6.9a.75.75 0 0 1 0 1.5h-6.9a.25.25 0 0 0-.23.16l-2.62 6.72a.75.75 0 0 0 .94.98 60.4 60.4 0 0 0 16.42-8.86.75.75 0 0 0 0-1.2A60.4 60.4 0 0 0 2.94 2.06Z" />
          </svg>
        </Button>
      </div>
      <p className="px-5 pb-3 text-xs text-ink-400">
        <span className="font-semibold text-brand-600">{AI_MENTION}</span>로 시작한 메시지만 AI가 처리합니다. 나머지는
        팀원끼리의 대화로만 남아요.
      </p>
    </div>
  )
}
