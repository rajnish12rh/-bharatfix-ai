import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="BharatFix AI home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 shadow-sm">
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-civic" />
        <span className="h-4 w-5 rounded-sm border-2 border-white/90" />
        <span className="absolute h-0.5 w-5 rotate-12 bg-civic" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-bold tracking-tight text-navy-900">
          BharatFix AI
        </span>
        <span className="block text-[11px] font-medium text-slate-500">
          Smart Infrastructure
        </span>
      </span>
    </Link>
  )
}
