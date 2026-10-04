import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeProps = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-3 py-1 text-xs font-semibold text-navy-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
