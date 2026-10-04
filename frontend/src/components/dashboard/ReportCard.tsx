import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../../services/api'
import type { ReportRecord, ReportStatus } from '../../types'
import { formatReportTimestamp } from '../../utils/report'
import { severityBadgeClass } from '../../utils/severity'
import { REPORT_STATUSES, statusBadgeClass } from '../../utils/status'

type ReportCardProps = {
  report: ReportRecord
  isUpdating: boolean
  onStatusChange: (reportId: string, status: ReportStatus) => void
}

export function ReportCard({ report, isUpdating, onStatusChange }: ReportCardProps) {
  const selectId = `status-${report.reportId}`

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex-row">
      <img
        src={resolveImageUrl(report.imageUrl)}
        alt={`${report.issueType} reported as ${report.reportId}`}
        className="h-44 w-full bg-slate-100 object-cover sm:h-auto sm:w-40"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to={`/track/${encodeURIComponent(report.reportId)}`}
            className="font-mono text-sm font-bold text-navy-900 hover:underline"
          >
            {report.reportId}
          </Link>
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityBadgeClass[report.severity]}`}
            >
              {report.severity}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass[report.status]}`}
            >
              {report.status}
            </span>
          </div>
        </div>

        <div>
          <p className="text-base font-bold text-navy-900">{report.issueType}</p>
          <p className="text-sm text-slate-600">
            {report.category} · {report.confidence}% confidence
            {report.isDemoAnalysis ? ' (demo)' : ''}
          </p>
        </div>

        <p className="flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
          <span>
            {report.locationDescription || 'No description'} · {report.latitude.toFixed(4)},{' '}
            {report.longitude.toFixed(4)}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">{formatReportTimestamp(report.createdAt)}</p>
          <div className="flex items-center gap-2">
            <label htmlFor={selectId} className="text-xs font-semibold text-slate-600">
              Status
            </label>
            <select
              id={selectId}
              value={report.status}
              disabled={isUpdating}
              onChange={(event) => onStatusChange(report.reportId, event.target.value as ReportStatus)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-100 disabled:opacity-50"
            >
              {REPORT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </article>
  )
}
