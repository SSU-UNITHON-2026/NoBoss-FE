export function formatDday(dateStr: string, from: Date = new Date()): string {
  const target = new Date(dateStr)
  const diffMs = target.setHours(0, 0, 0, 0) - new Date(from).setHours(0, 0, 0, 0)
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'D-day'
  return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}
