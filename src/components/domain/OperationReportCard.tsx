import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Select from '../ui/Select'
import ReportList from './ReportList'
import { SORT_OPTIONS } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

interface OperationReportCardProps {
  reports: OperationReport[]
  onCreate?: () => void
  onOpen?: (report: OperationReport) => void
  onTogglePublish?: (report: OperationReport) => void
  onLoadMore?: () => void
}

/** 사용자 대시보드의 "운영 보고서" 카드. */
function OperationReportCard({
  reports,
  onCreate,
  onOpen,
  onTogglePublish,
  onLoadMore,
}: OperationReportCardProps) {
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  return (
    <Card
      title="운영 보고서"
      flush
      actionClassName="gap-3!"
      action={
        <>
          <Button onClick={onCreate}>전월 재무재표보고서 생성</Button>
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </>
      }
    >
      <ReportList
        reports={reports}
        variant="owner"
        onOpen={onOpen}
        onTogglePublish={onTogglePublish}
        onLoadMore={onLoadMore}
      />
    </Card>
  )
}

export default OperationReportCard
