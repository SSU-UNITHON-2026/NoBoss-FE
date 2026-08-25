import { useState } from 'react'
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
  className,
}: TeamChatPanelProps) {
  const [draft, setDraft] = useState('')
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
            </li>
          )
        })}
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
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button type="button" onClick={handleSend}>
          전송
        </Button>
      </div>
      <p className="px-5 pb-3 text-xs text-ink-400">
        <span className="font-semibold text-brand-600">{AI_MENTION}</span>로 시작한 메시지만 AI가 처리합니다. 나머지는
        팀원끼리의 대화로만 남아요.
      </p>
    </div>
  )
}
