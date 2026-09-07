import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Select from '../ui/Select'
import ReportList from './ReportList'
import ApiReportList from './ApiReportList'
import { ErrorState } from '../ui/StateView'
import type { ReportListItem } from '../../api'
import { SORT_OPTIONS } from '../../data/mock'
import type { OperationReport } from '../../data/mock'

interface OperationReportCardProps {
  reports?: OperationReport[]
  onCreate?: () => void
  onOpen?: (report: OperationReport) => void
  onTogglePublish?: (report: OperationReport) => void
  onLoadMore?: () => void
  /** 서버에서 받아온 보고서 목록. 주어지면 이쪽을 우선 렌더한다. */
  apiReports?: ReportListItem[]
  onApiOpen?: (report: ReportListItem) => void
  onSortChange?: (value: string) => void
  apiError?: string | null
  /** Stretch the card to fill a stretched dashboard column. */
  fill?: boolean
}

/**
 * 사업자 대시보드의 "운영 보고서" 카드.
 *
 * `apiReports` 가 있으면 서버 목록(ApiReportList)을, 없으면 목데이터 목록을
 * 보여준다 — dev 의 분기를 그대로 유지한다. 정렬 변경은 상위로 올려 서버 재조회에
 * 쓰인다.
 */
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
      description="월별 재무제표와 위험도 분석 결과입니다."
      flush
      fill={fill}
      className={fill ? 'flex-1' : undefined}
      actionClassName="flex-row! items-center! gap-2!"
      action={
        <>
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
          <Button size="md" onClick={onCreate}>
            전월 보고서 작성
          </Button>
        </>
      }
    >
      {apiReports ? (
        <>
          {apiError && <ErrorState message={apiError} />}
          <ApiReportList
            reports={apiReports}
            onOpen={onApiOpen}
            onLoadMore={onLoadMore}
            fill={fill}
          />
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
