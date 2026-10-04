import 'leaflet/dist/leaflet.css'
import { latLngBounds } from 'leaflet'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import type { ReportRecord, SeverityLevel } from '../../types'

const INDIA_CENTER: [number, number] = [22.5, 79]

const severityColor: Record<SeverityLevel, string> = {
  Low: '#059669',
  Medium: '#d97706',
  High: '#dc2626',
}

type ReportsMapProps = {
  reports: ReportRecord[]
  className?: string
}

function FitToReports({ reports }: { reports: ReportRecord[] }) {
  const map = useMap()

  useEffect(() => {
    if (reports.length === 0) {
      map.setView(INDIA_CENTER, 4)
      return
    }

    if (reports.length === 1) {
      const [report] = reports
      if (report) {
        map.setView([report.latitude, report.longitude], 15)
      }
      return
    }

    const bounds = latLngBounds(reports.map((report) => [report.latitude, report.longitude]))
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
  }, [map, reports])

  return null
}

export function ReportsMap({ reports, className }: ReportsMapProps) {
  return (
    <div className={`isolate overflow-hidden rounded-2xl border border-slate-200 ${className ?? 'h-80'}`}>
      <MapContainer center={INDIA_CENTER} zoom={4} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <CircleMarker
            key={report.reportId}
            center={[report.latitude, report.longitude]}
            radius={9}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: severityColor[report.severity],
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-mono font-bold">{report.reportId}</p>
                <p className="mt-1">
                  {report.issueType} · {report.severity}
                </p>
                <p className="text-slate-500">{report.status}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        <FitToReports reports={reports} />
      </MapContainer>
    </div>
  )
}
