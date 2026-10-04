import type { SeverityLevel } from '../../types'
import { cn } from '../../utils/cn'
import {
  SEVERITY_LEVELS,
  severityDotClass,
  severitySelectedClass,
} from '../../utils/severity'
import { StepNav } from './StepNav'

const severityHelp: Record<SeverityLevel, string> = {
  Low: 'Minor wear or limited disruption.',
  Medium: 'Noticeable damage that should be scheduled.',
  High: 'Urgent hazard that may need faster attention.',
}

type SeverityStepProps = {
  severity: SeverityLevel
  onChange: (severity: SeverityLevel) => void
  onBack: () => void
  onContinue: () => void
}

export function SeverityStep({
  severity,
  onChange,
  onBack,
  onContinue,
}: SeverityStepProps) {
  return (
    <div>
      <p className="text-sm leading-6 text-slate-600">
        Severity helps authorities prioritize reports that may require faster
        attention.
      </p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Selected severity
        </p>
        <p className="mt-1 text-2xl font-bold text-navy-900">{severity}</p>
      </div>

      <div
        className="mt-5 grid gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Severity level"
      >
        {SEVERITY_LEVELS.map((level) => {
          const selected = severity === level

          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(level)}
              className={cn(
                'rounded-2xl border bg-white px-4 py-4 text-left shadow-sm',
                selected ? severitySelectedClass[level] : 'border-slate-200 hover:bg-slate-50',
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn('h-2.5 w-2.5 rounded-full', severityDotClass[level])}
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-navy-900">{level}</span>
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-600">
                {severityHelp[level]}
              </span>
            </button>
          )
        })}
      </div>

      <StepNav onBack={onBack} onContinue={onContinue} continueLabel="Continue" />
    </div>
  )
}
