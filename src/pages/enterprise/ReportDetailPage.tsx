import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Badge from '../../components/ui/Badge'
import ReportViewer from '../../components/domain/ReportViewer'
import { getReport, getStore } from '../../data/mock'

/** 운영보고서 상세 (기업 로그인 — 읽기 전용). */
function ReportDetailPage() {
  const { storeId, reportId } = useParams()
  const store = getStore(storeId)
  const report = getReport(reportId)

  return (
    <PageContainer width="narrow">
      <PageHeading
        size="lg"
        backTo="history"
        eyebrow={`${store.region} · ${store.name}`}
        title={report.period}
        meta={<Badge tone="neutral" size="sm">읽기 전용</Badge>}
        subtitle={`${store.manager} · 위험도 ${report.riskPercent}`}
      />
      <ReportViewer content={report.content} />
    </PageContainer>
  )
}

export default ReportDetailPage
