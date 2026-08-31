import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Select from '../../components/ui/Select'
import ReportList from '../../components/domain/ReportList'
import { operationReports, SORT_OPTIONS } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

/** 재무제표보고서 더보기 페이지 (사업자 로그인 — 공개/비공개 관리). */
function OwnerReportsPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState(operationReports)
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  const togglePublish = (target: OperationReport) =>
    setReports((prev) =>
      prev.map((r) => (r.id === target.id ? { ...r, published: !r.published } : r)),
    )

  return (
    <PageContainer>
      <PageHeading
        title="운영보고서"
        actions={
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        }
      />
      <ReportList
        reports={reports}
        variant="owner"
        onOpen={(report) => navigate(`/owner/reports/${report.id}`)}
        onTogglePublish={togglePublish}
        onLoadMore={() => undefined}
      />
    </PageContainer>
  )
}

export default OwnerReportsPage
