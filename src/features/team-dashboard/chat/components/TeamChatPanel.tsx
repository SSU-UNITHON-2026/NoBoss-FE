import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { ChatMessage } from '@/types/chat'

interface QuickAction {
  label: string
  onClick: () => void
}

interface TeamChatPanelProps {
  title?: string
  memberCount: number
  messages: ChatMessage[]
  currentUserId: string
  memberNameById: Record<string, string>
  quickActions?: QuickAction[]
  onSend?: (text: string) => void
}

export function TeamChatPanel({
  title = '팀 채팅방',
  memberCount,
  messages,
  currentUserId,
  memberNameById,
  quickActions,
  onSend,
}: TeamChatPanelProps) {
  const [draft, setDraft] = useState('')

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft('')
  }

  return (
    <div className="rounded-lg border border-surface-border">
      <div className="flex items-center justify-between border-b border-surface-border px-5 py-3">
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-sm text-ink-600">{memberCount}명 · NOBOSS AI 참여 중</p>
      </div>

      <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto px-5 py-4">
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
                {message.text}
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
      <p className="px-5 pb-3 text-xs text-ink-400">마감 D-2 이내 미완료 항목은 NOBOSS AI가 담당자를 태그해 자동으로 리마인드합니다.</p>
    </div>
  )
}
