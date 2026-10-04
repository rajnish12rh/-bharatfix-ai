import type { ReportDraft } from '../../types'
import { formatFileSize } from '../../utils/file'
import { formatReportTimestamp } from '../../utils/report'
import { severityBadgeClass } from '../../utils/severity'
import { Badge } from '../ui/Badge'
import { StepNav } from './StepNav'

type ReviewStepProps = {
  draft: ReportDraft
  isSubmitting: boolean
  submitError?: string | null
  onBack: () => void
  onSubmit: () => void
}

export function ReviewStep({
  draft,
  isSubmitting,
  submitError,
  onBack,
  onSubmit,
}: ReviewStepProps) {
  const { file, previewUrl, analysis, severity, location, reviewedAt } = draft

  return (
    <div>
      <p className="text-sm leading-6 text-slate-600">
        Review the structured report before submitting. The report will be saved
        to BharatFix AI for tracking.
      </p>

      <div className="mt-5 space-y-4">
        {previewUrl ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={previewUrl}
              alt="Uploaded infrastructure issue"
              className="max-h-64 w-full object-contain"
            />
            {file ? (
              <p className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
                {file.name} · {formatFileSize(file.size)}
              </p>
            ) : null}
          </div>
        ) : null}

        <dl className="grid gap-3 sm:grid-cols-2">
          <ReviewItem label="Detected issue" value={analysis?.detectedIssue ?? '—'} />
          <ReviewItem label="Category" value={analysis?.category ?? '—'} />
          <ReviewItem
            label="AI confidence"
            value={analysis ? `${analysis.confidence}%` : '—'}
          />
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Severity
            </dt>
            <dd className="mt-1">
              {severity ? (
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${severityBadgeClass[severity]}`}
                >
                  {severity}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <ReviewItem label="Latitude" value={location.latitude || '—'} />
          <ReviewItem label="Longitude" value={location.longitude || '—'} />
          <ReviewItem
            label="Location description"
            value={location.description.trim() || 'Not provided'}
            wide
          />
          <ReviewItem
            label="Timestamp"
            value={reviewedAt ? formatReportTimestamp(reviewedAt) : '—'}
            wide
          />
        </dl>

        {analysis ? (
          analysis.isDemo ? (
            <Badge className="border-amber-200 bg-amber-50 text-amber-800">
              Demo AI Analysis
            </Badge>
          ) : (
            <Badge className="border-civic-soft bg-civic-soft/40 text-civic-dark">
              AI Analysis
            </Badge>
          )
        ) : null}
      </div>

      {submitError ? (
        <p className="mt-4 text-sm font-medium text-severity-high" role="alert">
          {submitError}
        </p>
      ) : null}

      <StepNav
        onBack={onBack}
        onContinue={onSubmit}
        continueLabel="Submit Report"
        continueLoading={isSubmitting}
      />
    </div>
  )
}

function ReviewItem({
  label,
  value,
  wide,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 ${wide ? 'sm:col-span-2' : ''}`}
    >
      <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  )
}
