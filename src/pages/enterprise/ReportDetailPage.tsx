import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import ReportViewer from '../../components/domain/ReportViewer'
import { getReport, getStore } from '../../data/mock'

/** 운영보고서 상세 (기업 로그인 — 읽기 전용). */
function ReportDetailPage() {
  const { storeId, reportId } = useParams()
  const store = getStore(storeId)
  const report = getReport(reportId)

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        title={`${store.region} | ${store.name} 운영보고서`}
        meta={report.period}
        subtitle={store.manager}
      />
      <ReportViewer content={report.content} />
    </PageContainer>
  )
}

export default ReportDetailPage
