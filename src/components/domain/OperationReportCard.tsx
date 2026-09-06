import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Select from '../ui/Select'
import ReportList from './ReportList'
import ApiReportList from './ApiReportList'
import type { ReportListItem } from '../../api'
import { SORT_OPTIONS } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

interface OperationReportCardProps {
  reports?: OperationReport[]
  onCreate?: () => void
  onOpen?: (report: OperationReport) => void
  onTogglePublish?: (report: OperationReport) => void
  onLoadMore?: () => void
  apiReports?: ReportListItem[]
  onApiOpen?: (report: ReportListItem) => void
  onSortChange?: (value: string) => void
  apiError?: string | null
  /** Stretch the card to fill a stretched dashboard column (bottom edges align). */
  fill?: boolean
}

/** 사용자 대시보드의 "운영 보고서" 카드. */
function OperationReportCard({
  reports,
  onCreate,
  onOpen,
  onTogglePublish,
  onLoadMore,
  apiReports,
  onApiOpen,
  onSortChange,
  apiError = null,
  fill = false,
}: OperationReportCardProps) {
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  return (
    <Card
      title="운영 보고서"
      flush
      fill={fill}
      className={fill ? 'flex-1' : undefined}
      actionClassName="gap-3!"
      action={
        <>
          <Button onClick={onCreate}>전월 재무재표보고서 생성</Button>
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              onSortChange?.(e.target.value)
            }}
          />
        </>
      }
    >
      {apiReports ? (
        <>
          {apiError && (
            <p role="alert" className="border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
              {apiError}
            </p>
          )}
          <ApiReportList reports={apiReports} onOpen={onApiOpen} onLoadMore={onLoadMore} fill={fill} />
        </>
      ) : (
        <ReportList
          reports={reports ?? []}
          variant="owner"
          onOpen={onOpen}
          onTogglePublish={onTogglePublish}
          onLoadMore={onLoadMore}
          fill={fill}
        />
      )}
    </Card>
  )
}

export default OperationReportCard
