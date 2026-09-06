import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import DashboardGrid from '../../components/layout/DashboardGrid'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import OperationReportCard from '../../components/domain/OperationReportCard'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import SolutionCards from '../../components/domain/SolutionCards'
import { currentStore, operationReports } from '../../data/mock'
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
      <PageHeading
        eyebrow={currentStore.region}
        title={currentStore.name}
        subtitle="이번 달 운영 상태와 보고서를 확인하세요."
      />

      <DashboardGrid
        stretch
        left={
          <>
            <RiskSummaryCard percent="OO%" />
            <OperationReportCard
              fill
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
            <SolutionCards
              fill
              onSelect={(product) => navigate(`/finance/${product.id}`)}
              onLoadMore={() => navigate('/finance/all')}
            />
          </>
        }
      />
    </PageContainer>
  )
}

export default OwnerDashboardPage
