import { Check } from 'lucide-react'
import type { ReportStep } from '../../types'
import { cn } from '../../utils/cn'

const STEPS: Array<{ id: ReportStep; label: string }> = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Analyze' },
  { id: 3, label: 'Severity' },
  { id: 4, label: 'Location' },
  { id: 5, label: 'Submit' },
]

type ReportProgressProps = {
  currentStep: ReportStep
  onStepSelect?: (step: ReportStep) => void
}

export function ReportProgress({ currentStep, onStepSelect }: ReportProgressProps) {
  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2" aria-label="Report progress">
      {STEPS.map((step, index) => {
        const completed = step.id < currentStep
        const current = step.id === currentStep
        const clickable = completed && onStepSelect

        return (
          <li key={step.id} className="min-w-0">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onStepSelect?.(step.id)}
              className={cn(
                'flex w-full flex-col items-center gap-2 rounded-xl px-1 py-1 text-center',
                clickable && 'hover:bg-navy-50',
                !clickable && 'cursor-default',
              )}
              aria-current={current ? 'step' : undefined}
            >
              <span className="flex w-full items-center">
                <span
                  className={cn(
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    completed && 'bg-civic text-white',
                    current && 'bg-navy-900 text-white',
                    !completed && !current && 'bg-slate-200 text-slate-500',
                  )}
                >
                  {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : step.id}
                </span>
              </span>
              <span
                className={cn(
                  'text-[11px] font-semibold sm:text-xs',
                  current ? 'text-navy-900' : 'text-slate-500',
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 ? (
              <span className="sr-only">{`${step.label} then ${STEPS[index + 1]?.label}`}</span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
