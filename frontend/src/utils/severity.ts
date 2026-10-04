import type { SeverityLevel } from '../types'

export const SEVERITY_LEVELS: SeverityLevel[] = ['Low', 'Medium', 'High']

export const severityBadgeClass: Record<SeverityLevel, string> = {
  Low: 'bg-civic-soft text-civic-dark',
  Medium: 'bg-amber-50 text-severity-medium',
  High: 'bg-red-50 text-severity-high',
}

export const severitySelectedClass: Record<SeverityLevel, string> = {
  Low: 'border-civic bg-civic-soft/40 ring-2 ring-civic/20',
  Medium: 'border-severity-medium bg-amber-50 ring-2 ring-amber-200',
  High: 'border-severity-high bg-red-50 ring-2 ring-red-200',
}

export const severityDotClass: Record<SeverityLevel, string> = {
  Low: 'bg-civic',
  Medium: 'bg-severity-medium',
  High: 'bg-severity-high',
}
