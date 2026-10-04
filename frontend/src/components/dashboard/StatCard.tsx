import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  hint?: string
  tone?: 'navy' | 'civic' | 'high'
}

const toneClass = {
  navy: 'bg-navy-50 text-navy-800',
  civic: 'bg-civic-soft text-civic-dark',
  high: 'bg-red-50 text-severity-high',
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'navy' }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-navy-900">{value}</p>
        </div>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneClass[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </article>
  )
}
