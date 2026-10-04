import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'
import { Button } from '../ui/Button'

type StepNavProps = {
  onBack?: () => void
  onContinue?: () => void
  continueLabel: string
  continueDisabled?: boolean
  continueLoading?: boolean
  hideContinue?: boolean
}

export function StepNav({
  onBack,
  onContinue,
  continueLabel,
  continueDisabled,
  continueLoading,
  hideContinue,
}: StepNavProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {onBack ? (
        <Button variant="secondary" onClick={onBack} className="sm:min-w-28">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
      ) : (
        <span />
      )}

      {hideContinue ? null : (
        <Button
          onClick={onContinue}
          disabled={continueDisabled || continueLoading}
          className="sm:min-w-44"
        >
          {continueLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
          {continueLabel}
        </Button>
      )}
    </div>
  )
}
