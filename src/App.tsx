import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import RequireRole from './routes/RequireRole'
import LoginPage from './pages/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import LocationAnalysisPage from './pages/LocationAnalysisPage'
import EnterpriseDashboardPage from './pages/enterprise/EnterpriseDashboardPage'
import StoreDirectoryPage from './pages/enterprise/StoreDirectoryPage'
import StoreReportsPage from './pages/enterprise/StoreReportsPage'
import ReportDetailPage from './pages/enterprise/ReportDetailPage'
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import OwnerReportsPage from './pages/owner/OwnerReportsPage'
import OwnerReportDetailPage from './pages/owner/OwnerReportDetailPage'
import FinancialReportFormPage from './pages/owner/FinancialReportFormPage'
import { focusStores, rankingStores } from './data/mock'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 기업(관리자) 로그인 flow */}
      <Route element={<RequireRole role="enterprise" />}>
        <Route element={<AppLayout />}>
          <Route path="/enterprise" element={<EnterpriseDashboardPage />} />
          <Route path="/enterprise/location-analysis" element={<LocationAnalysisPage />} />
          <Route
            path="/enterprise/ranking"
            element={<StoreDirectoryPage title="매출 TOP 점포 랭킹" stores={rankingStores} />}
          />
          <Route
            path="/enterprise/focus-stores"
            element={<StoreDirectoryPage title="집중 관리 필요 점포" stores={focusStores} />}
          />
          <Route
            path="/enterprise/stores/:storeId/reports"
            element={<StoreReportsPage />}
          />
          <Route
            path="/enterprise/stores/:storeId/reports/:reportId"
            element={<ReportDetailPage />}
          />
        </Route>
      </Route>

      {/* 사업자(사용자) 로그인 flow */}
      <Route element={<RequireRole role="owner" />}>
        <Route element={<AppLayout />}>
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/owner/location-analysis" element={<LocationAnalysisPage />} />
          <Route path="/owner/reports" element={<OwnerReportsPage />} />
          <Route path="/owner/reports/new" element={<FinancialReportFormPage />} />
          <Route path="/owner/reports/:reportId" element={<OwnerReportDetailPage />} />
        </Route>
      </Route>

      {/* 주석으로만 존재하는 외부 이동 대상 */}
      <Route element={<AppLayout />}>
        <Route path="/property/:resultId" element={<PlaceholderPage title="부동산 매물 페이지" />} />
        <Route path="/finance/:productId" element={<PlaceholderPage title="금융 상품 페이지" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
