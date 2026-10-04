import { Check, LoaderCircle, MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReportsMap } from '../components/dashboard/ReportsMap'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getReport, resolveImageUrl } from '../services/api'
import type { ReportRecord } from '../types'
import { cn } from '../utils/cn'
import { formatReportTimestamp } from '../utils/report'
import { severityBadgeClass } from '../utils/severity'
import { REPORT_STATUSES, statusBadgeClass } from '../utils/status'

export function TrackReportPage() {
  const { reportId: routeReportId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(routeReportId ?? '')
  const [report, setReport] = useState<ReportRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!routeReportId) {
      setReport(null)
      setError(null)
      return
    }

    let cancelled = false
    setQuery(routeReportId)
    setIsLoading(true)
    setError(null)

    getReport(routeReportId)
      .then((result) => {
        if (!cancelled) {
          setReport(result)
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setReport(null)
          setError(loadError instanceof Error ? loadError.message : 'Failed to load report.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [routeReportId])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim().toUpperCase()
    if (!trimmed) {
      setError('Enter a report ID such as BF-2026-123456.')
      return
    }

    navigate(`/track/${encodeURIComponent(trimmed)}`)
  }

  const currentStatusIndex = report ? REPORT_STATUSES.indexOf(report.status) : -1
  const mapReports = useMemo(() => (report ? [report] : []), [report])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
          Track Your Report
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Enter the report ID you received after submitting to see its latest status.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <label htmlFor="track-report-id" className="sr-only">
          Report ID
        </label>
        <input
          id="track-report-id"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. BF-2026-123456"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-navy-900 uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-100"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
          Track
        </Button>
      </form>

      {error ? (
        <p
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-severity-high"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {report ? (
        <section className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Report ID</p>
              <p className="font-mono text-xl font-bold text-navy-900">{report.reportId}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClass[report.status]}`}
            >
              {report.status}
            </span>
          </div>

          <ol className="grid grid-cols-3 gap-2" aria-label="Report status progress">
            {REPORT_STATUSES.map((status, index) => {
              const done = index <= currentStatusIndex
              return (
                <li key={status} className="flex flex-col items-center gap-2 text-center">
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
                      done ? 'bg-civic text-white' : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      done ? 'text-navy-900' : 'text-slate-500',
                    )}
                  >
                    {status}
                  </span>
                </li>
              )
            })}
          </ol>

          <img
            src={resolveImageUrl(report.imageUrl)}
            alt={`${report.issueType} reported as ${report.reportId}`}
            className="max-h-72 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain"
          />

          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Detected issue" value={report.issueType} />
            <DetailItem label="Category" value={report.category} />
            <DetailItem label="AI confidence" value={`${report.confidence}%`} />
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Severity</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${severityBadgeClass[report.severity]}`}
                >
                  {report.severity}
                </span>
              </dd>
            </div>
            <DetailItem label="Submitted" value={formatReportTimestamp(report.createdAt)} />
            <DetailItem label="Last updated" value={formatReportTimestamp(report.updatedAt)} />
          </dl>

          {report.isDemoAnalysis ? (
            <Badge className="border-amber-200 bg-amber-50 text-amber-800">Demo AI Analysis</Badge>
          ) : null}

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
              <MapPin className="h-4 w-4 text-navy-600" aria-hidden="true" />
              {report.locationDescription || 'Reported location'}
            </p>
            <ReportsMap reports={mapReports} className="h-64" />
          </div>
        </section>
      ) : null}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  )
}
