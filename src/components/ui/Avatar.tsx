import { cn } from '@/lib/cn'

interface AvatarProps {
  name: string
  className?: string
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600',
        className,
      )}
    >
      {name.slice(0, 1)}
    </div>
  )
}
