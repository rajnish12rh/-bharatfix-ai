export type SeverityLevel = 'Low' | 'Medium' | 'High'
export type Severity = SeverityLevel

export type AnalysisResult = {
  detectedIssue: string
  category: string
  confidence: number
  severity: SeverityLevel
  isDemo: boolean
  source: 'demo' | 'gemini'
}

export type LocationData = {
  latitude: string
  longitude: string
  description: string
}

export type ReportDraft = {
  file: File | null
  previewUrl: string | null
  analysis: AnalysisResult | null
  severity: SeverityLevel | null
  location: LocationData
  reviewedAt: string | null
}

export type ReportStep = 1 | 2 | 3 | 4 | 5

export type ReportStatus = 'Submitted' | 'In Review' | 'Resolved'

export type ReportRecord = {
  reportId: string
  issueType: string
  category: string
  confidence: number
  isDemoAnalysis: boolean
  severity: SeverityLevel
  latitude: number
  longitude: number
  locationDescription: string
  imageUrl: string
  imagePath: string
  status: ReportStatus
  createdAt: string
  updatedAt: string
}

export type ReportFilters = {
  severity?: SeverityLevel | 'All'
  status?: ReportStatus | 'All'
}

export type DashboardStats = {
  total: number
  bySeverity: Record<SeverityLevel, number>
  byStatus: Record<ReportStatus, number>
  openHighPriority: number
  last7Days: number
}

export type NavItem = {
  label: string
  to: string
}

export type WorkflowItem = {
  title: string
  description: string
}

export type ProcessStep = {
  number: string
  title: string
  description: string
}
