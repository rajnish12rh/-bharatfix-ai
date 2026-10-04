import { CheckCircle2, LayoutDashboard, RotateCcw, Search } from 'lucide-react'
import { Button } from '../ui/Button'

type ReportSuccessProps = {
  reportId: string
  onReportAnother: () => void
}

export function ReportSuccess({ reportId, onReportAnother }: ReportSuccessProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-civic-soft text-civic">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
        Report Submitted Successfully
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
        Your report has been prepared for tracking.
      </p>
      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-civic-soft bg-civic-soft/40 px-4 py-4">
        <p className="text-xs font-semibold tracking-wide text-civic-dark uppercase">
          Report ID
        </p>
        <p className="mt-1 font-mono text-xl font-bold text-navy-900">{reportId}</p>
      </div>
      <p className="mx-auto mt-4 max-w-md text-xs text-slate-500">
        Save this ID to check the status of your report anytime.
      </p>
      <div className="mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
        <Button to={`/track/${encodeURIComponent(reportId)}`}>
          <Search className="h-4 w-4" aria-hidden="true" />
          Track Report
        </Button>
        <Button variant="secondary" onClick={onReportAnother}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Report Another Issue
        </Button>
        <Button to="/dashboard" variant="secondary">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          View Dashboard
        </Button>
      </div>
    </section>
  )
}
