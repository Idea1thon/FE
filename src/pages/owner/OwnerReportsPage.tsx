import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import ReportList from '../../components/domain/ReportList'
import { operationReports, SORT_OPTIONS } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

/** 운영보고서 목록 (사업자 로그인 — 공개/비공개 관리). */
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
        backTo="/owner"
        subtitle="공개로 설정한 보고서는 본사에서 확인할 수 있습니다."
        actions={
          <>
            <Select
              variant="inline"
              ariaLabel="정렬 기준"
              options={SORT_OPTIONS}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            />
            <Button size="md" onClick={() => navigate('/owner/reports/new')}>
              전월 보고서 작성
            </Button>
          </>
        }
      />
      <Card flush>
        <ReportList
          reports={reports}
          variant="owner"
          onOpen={(report) => navigate(`/owner/reports/${report.id}`)}
          onTogglePublish={togglePublish}
        />
      </Card>
    </PageContainer>
  )
}

export default OwnerReportsPage
