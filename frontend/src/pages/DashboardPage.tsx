import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ReportCard } from '../components/dashboard/ReportCard'
import { ReportsMap } from '../components/dashboard/ReportsMap'
import { StatCard } from '../components/dashboard/StatCard'
import { Button } from '../components/ui/Button'
import {
  ApiError,
  getDashboardStats,
  getReports,
  updateReportStatus,
} from '../services/api'
import type {
  DashboardStats,
  ReportRecord,
  ReportStatus,
  SeverityLevel,
} from '../types'
import { getAdminKey, setAdminKey } from '../utils/adminKey'
import { SEVERITY_LEVELS, severityDotClass } from '../utils/severity'
import { REPORT_STATUSES } from '../utils/status'

type SeverityFilter = SeverityLevel | 'All'
type StatusFilter = ReportStatus | 'All'
type PendingStatusChange = { reportId: string; status: ReportStatus }

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [severity, setSeverity] = useState<SeverityFilter>('All')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [adminKey, setAdminKeyState] = useState(getAdminKey)
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [pendingChange, setPendingChange] = useState<PendingStatusChange | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [nextStats, nextReports] = await Promise.all([
        getDashboardStats(),
        getReports({ severity, status }),
      ])
      setStats(nextStats)
      setReports(nextReports)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard.')
    } finally {
      setIsLoading(false)
    }
  }, [severity, status])

  useEffect(() => {
    void load()
  }, [load])

  async function handleStatusChange(
    reportId: string,
    nextStatus: ReportStatus,
    key: string = adminKey,
  ) {
    setUpdatingId(reportId)
    setError(null)

    try {
      const updated = await updateReportStatus(reportId, nextStatus, key || undefined)
      setPendingChange(null)
      setReports((current) =>
        current
          .map((report) => (report.reportId === reportId ? updated : report))
          .filter((report) => status === 'All' || report.status === status),
      )
      setStats(await getDashboardStats())
    } catch (updateError) {
      if (updateError instanceof ApiError && updateError.status === 401) {
        setPendingChange({ reportId, status: nextStatus })
        if (key) {
          setAdminKey('')
          setAdminKeyState('')
          setError('That admin key was not accepted. Please try again.')
        }
      } else {
        setError(updateError instanceof Error ? updateError.message : 'Failed to update status.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  function handleAdminKeySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const key = adminKeyInput.trim()
    if (!key || !pendingChange) {
      return
    }

    setAdminKey(key)
    setAdminKeyState(key)
    setAdminKeyInput('')
    void handleStatusChange(pendingChange.reportId, pendingChange.status, key)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Civic Issue Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Track reported infrastructure problems, prioritize by severity and
            update their status as they move toward resolution.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void load()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </Button>
      </header>

      {error ? (
        <p
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-severity-high"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {pendingChange ? (
        <form
          onSubmit={handleAdminKeySubmit}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-navy-100 bg-navy-50 p-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="admin-key"
              className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-navy-900"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Admin key required
            </label>
            <p className="mb-2 text-xs text-slate-600">
              Enter the admin key to mark {pendingChange.reportId} as “{pendingChange.status}”.
            </p>
            <input
              id="admin-key"
              type="password"
              autoComplete="off"
              value={adminKeyInput}
              onChange={(event) => setAdminKeyInput(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-100"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={!adminKeyInput.trim()}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setPendingChange(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
        <StatCard
          icon={ClipboardList}
          label="Total reports"
          value={stats?.total ?? 0}
          hint={`${stats?.last7Days ?? 0} in the last 7 days`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Open high priority"
          value={stats?.openHighPriority ?? 0}
          hint="High severity, not yet resolved"
          tone="high"
        />
        <StatCard
          icon={TrendingUp}
          label="In review"
          value={stats?.byStatus['In Review'] ?? 0}
          hint={`${stats?.byStatus.Submitted ?? 0} awaiting review`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved"
          value={stats?.byStatus.Resolved ?? 0}
          hint="Issues fixed and closed"
          tone="civic"
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-navy-900">Report locations</h2>
            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              {SEVERITY_LEVELS.map((level) => (
                <span key={level} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${severityDotClass[level]}`} />
                  {level}
                </span>
              ))}
            </div>
          </div>
          <ReportsMap reports={reports} className="h-80" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy-900">By severity</h2>
          <ul className="mt-4 space-y-4">
            {SEVERITY_LEVELS.map((level) => {
              const count = stats?.bySeverity[level] ?? 0
              const percent = stats && stats.total > 0 ? Math.round((count / stats.total) * 100) : 0

              return (
                <li key={level}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy-900">{level}</span>
                    <span className="text-slate-500">
                      {count} · {percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${severityDotClass[level]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-bold tracking-tight text-navy-900">Reports</h2>
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              id="filter-severity"
              label="Severity"
              value={severity}
              options={['All', ...SEVERITY_LEVELS]}
              onChange={(value) => setSeverity(value as SeverityFilter)}
            />
            <FilterSelect
              id="filter-status"
              label="Status"
              value={status}
              options={['All', ...REPORT_STATUSES]}
              onChange={(value) => setStatus(value as StatusFilter)}
            />
          </div>
        </div>

        {isLoading && reports.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-sm text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin text-navy-800" aria-hidden="true" />
            Loading reports…
          </div>
        ) : null}

        {!isLoading && reports.length === 0 && !error ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-base font-bold text-navy-900">No reports found</p>
            <p className="mt-1 text-sm text-slate-600">
              {severity === 'All' && status === 'All'
                ? 'Reports submitted by citizens will appear here.'
                : 'Try changing the filters.'}
            </p>
            <Button to="/report" className="mt-5">
              Report an Issue
            </Button>
          </div>
        ) : null}

        {reports.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((report) => (
              <ReportCard
                key={report.reportId}
                report={report}
                isUpdating={updatingId === report.reportId}
                onStatusChange={(reportId, nextStatus) => {
                  void handleStatusChange(reportId, nextStatus)
                }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
