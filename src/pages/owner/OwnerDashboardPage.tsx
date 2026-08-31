import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import DashboardGrid from '../../components/layout/DashboardGrid'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import OperationReportCard from '../../components/domain/OperationReportCard'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import SolutionCards from '../../components/domain/SolutionCards'
import { operationReports } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

/** 사업자(사용자) 로그인 후 메인 대시보드. */
function OwnerDashboardPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState(operationReports)

  const togglePublish = (target: OperationReport) =>
    setReports((prev) =>
      prev.map((r) => (r.id === target.id ? { ...r, published: !r.published } : r)),
    )

  return (
    <PageContainer>
      <DashboardGrid
        left={
          <>
            <RiskSummaryCard percent="OO%" />
            <OperationReportCard
              reports={reports}
              onCreate={() => navigate('/owner/reports/new')}
              onOpen={(report) => navigate(`/owner/reports/${report.id}`)}
              onTogglePublish={togglePublish}
              onLoadMore={() => navigate('/owner/reports')}
            />
          </>
        }
        right={
          <>
            <StoreSearchCard onSearch={() => navigate('/owner/location-analysis')} />
            <SolutionCards />
          </>
        }
      />
    </PageContainer>
  )
}

export default OwnerDashboardPage
