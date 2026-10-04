import type {
  AnalysisResult,
  DashboardStats,
  ReportFilters,
  ReportRecord,
  ReportStatus,
  SeverityLevel,
} from '../types'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

export type CreateReportPayload = {
  file: File
  issueType: string
  category: string
  confidence: number
  isDemoAnalysis: boolean
  severity: SeverityLevel
  latitude: string
  longitude: string
  locationDescription: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function resolveImageUrl(imageUrl: string): string {
  return imageUrl.startsWith('http') ? imageUrl : `${API_ORIGIN}${imageUrl}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    throw new ApiError(
      'Cannot reach the BharatFix AI server. Make sure the backend is running.',
      0,
    )
  }

  let payload: ApiResponse<T>
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiError('The server returned an unexpected response.', response.status)
  }

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new ApiError(payload.message || 'Request failed.', response.status)
  }

  return payload.data
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append('image', file)

  return request<AnalysisResult>('/analyze', { method: 'POST', body: formData })
}

export async function createReport(input: CreateReportPayload): Promise<ReportRecord> {
  const formData = new FormData()
  formData.append('image', input.file)
  formData.append('issueType', input.issueType)
  formData.append('category', input.category)
  formData.append('confidence', String(input.confidence))
  formData.append('isDemoAnalysis', String(input.isDemoAnalysis))
  formData.append('severity', input.severity)
  formData.append('latitude', input.latitude)
  formData.append('longitude', input.longitude)
  formData.append('locationDescription', input.locationDescription)

  return request<ReportRecord>('/reports', { method: 'POST', body: formData })
}

export async function getReports(filters: ReportFilters = {}): Promise<ReportRecord[]> {
  const params = new URLSearchParams()
  if (filters.severity && filters.severity !== 'All') {
    params.set('severity', filters.severity)
  }
  if (filters.status && filters.status !== 'All') {
    params.set('status', filters.status)
  }

  const query = params.toString()
  return request<ReportRecord[]>(`/reports${query ? `?${query}` : ''}`)
}

export async function getReport(reportId: string): Promise<ReportRecord> {
  return request<ReportRecord>(`/reports/${encodeURIComponent(reportId.trim())}`)
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminKey?: string,
): Promise<ReportRecord> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (adminKey) {
    headers['x-admin-key'] = adminKey
  }

  return request<ReportRecord>(`/reports/${encodeURIComponent(reportId)}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats')
}
