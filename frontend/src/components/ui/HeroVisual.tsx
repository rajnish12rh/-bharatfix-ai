import { Camera, MapPin, ScanSearch } from 'lucide-react'
import type { Severity } from '../../types'

const severityClass: Record<Severity, string> = {
  Low: 'bg-civic-soft text-civic-dark',
  Medium: 'bg-amber-50 text-severity-medium',
  High: 'bg-red-50 text-severity-high',
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -top-7 -left-5 h-24 w-24 rounded-full bg-civic-soft" />
      <div className="absolute -right-4 -bottom-8 h-32 w-32 rounded-full bg-navy-100" />

      <div className="relative overflow-hidden rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-5 shadow-xl sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="absolute top-6 right-6 h-28 w-28 rounded-full border border-white/15" />
        <div className="absolute top-12 right-12 h-16 w-16 rounded-full border border-civic/50" />
        <div className="absolute top-[4.75rem] right-[4.75rem] h-6 w-6 rounded-full bg-civic" />

        <div className="relative mb-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
            <ScanSearch className="h-4 w-4 text-civic-soft" aria-hidden="true" />
            Live scan preview
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200">
            AI ready
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
          <div className="flex gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-navy-200">
              <div className="absolute inset-x-0 top-8 h-3 -rotate-6 bg-slate-400/80" />
              <div className="absolute inset-x-2 top-12 h-5 rounded-full bg-navy-800/20" />
              <div className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-white">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Detected issue
              </p>
              <p className="mt-1 text-base font-bold text-navy-900">
                Road surface damage
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <SeverityChip level="High" />
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-navy-600" aria-hidden="true" />
                  Ward 14
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat label="Capture" value="Ready" />
            <MiniStat label="Priority" value="High" tone="high" />
            <MiniStat label="Status" value="Draft" />
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <span>Standardized civic report</span>
          <span className="rounded-full bg-civic px-2.5 py-0.5 text-xs font-semibold text-white">
            Next: submit
          </span>
        </div>
      </div>
    </div>
  )
}

function SeverityChip({ level }: { level: Severity }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityClass[level]}`}
    >
      {level}
    </span>
  )
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'high'
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={`mt-0.5 text-xs font-bold ${
          tone === 'high' ? 'text-severity-high' : 'text-navy-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
