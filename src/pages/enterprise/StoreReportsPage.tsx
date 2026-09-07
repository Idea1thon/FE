import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import ApiReportList from '../../components/domain/ApiReportList'
import { SkeletonRows } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/StateView'
import { ApiError, fetchBranch, fetchBranchReports } from '../../api'
import type { BranchDetail, ReportListItem } from '../../api'
import { SORT_OPTIONS } from '../../data/mock'

/** 점포 운영보고서 목록 (기업 로그인 — 읽기 전용). */
function StoreReportsPage() {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const branchId = Number(storeId)
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)
  const [store, setStore] = useState<BranchDetail | null>(null)
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!Number.isInteger(branchId) || branchId < 1) {
      setError('올바르지 않은 점포입니다.')
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    Promise.all([
      fetchBranch(branchId),
      fetchBranchReports(branchId, sort === 'recent' ? 'month_desc' : 'month_asc'),
    ])
      .then(([branch, reportResponse]) => {
        if (!active) return
        setStore(branch)
        setReports(reportResponse.items)
        setError(null)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(cause instanceof ApiError ? cause.message : '점포 보고서를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [branchId, sort, nonce])

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        backTo="history"
        eyebrow={store?.region.name}
        title={store ? store.name : '점포 운영보고서'}
        subtitle={
          store
            ? `${store.owner.name} · ${store.business_category.name} · 운영보고서`
            : '점포 정보를 불러오는 중'
        }
        actions={
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={loading}
          />
        }
      />

      <Card flush>
        {error ? (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        ) : loading ? (
          <SkeletonRows rows={6} label="보고서를 불러오는 중" />
        ) : (
          <ApiReportList
            reports={reports}
            onOpen={(report) =>
              navigate(`/enterprise/stores/${branchId}/reports/${report.report_id}`)
            }
          />
        )}
      </Card>
    </PageContainer>
  )
}

export default StoreReportsPage
