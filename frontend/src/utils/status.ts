import type { ReportStatus } from '../types'

export const REPORT_STATUSES: ReportStatus[] = ['Submitted', 'In Review', 'Resolved']

export const statusBadgeClass: Record<ReportStatus, string> = {
  Submitted: 'bg-navy-50 text-navy-700',
  'In Review': 'bg-sky-50 text-sky-700',
  Resolved: 'bg-civic-soft text-civic-dark',
}
