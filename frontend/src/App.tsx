import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { ReportIssuePage } from './pages/ReportIssuePage'
import { TrackReportPage } from './pages/TrackReportPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/track" element={<TrackReportPage />} />
          <Route path="/track/:reportId" element={<TrackReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
