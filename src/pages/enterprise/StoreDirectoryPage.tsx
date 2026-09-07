import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import StoreList from '../../components/domain/StoreList'
import { SkeletonRows } from '../../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../../components/ui/StateView'
import { REGION_OPTIONS } from '../../data/mock'
import { useBranches } from '../../hooks/useBranches'

interface StoreDirectoryPageProps {
  title: string
  sort: 'net_sales_desc' | 'risk_desc'
}

function matchesRegion(region: string, selected: string) {
  if (selected === 'nation') return true
  if (selected === 'seoul') return region.startsWith('서울')
  if (selected === 'gyeonggi') return region.startsWith('경기')
  if (selected === 'incheon') return region.startsWith('인천')
  return true
}

/** 매출 TOP 점포 랭킹 / 집중 관리 필요 점포 전체 목록 (기업 로그인). */
function StoreDirectoryPage({ title, sort }: StoreDirectoryPageProps) {
  const navigate = useNavigate()
  const [region, setRegion] = useState(REGION_OPTIONS[0].value)
  const showRisk = sort === 'risk_desc'
  const branches = useBranches({ sort, limit: 500 }, showRisk)
  const stores = useMemo(
    () => branches.stores.filter((store) => matchesRegion(store.region, region)),
    [branches.stores, region],
  )

  const filteredOut = stores.length === 0 && branches.stores.length > 0

  return (
    <PageContainer>
      <PageHeading
        title={title}
        backTo="/enterprise"
        meta={!branches.loading && !branches.error ? <span className="num">{stores.length}곳</span> : undefined}
        subtitle={showRisk ? '위험도가 높은 순서입니다.' : '최신 보고서의 순매출 기준입니다.'}
        actions={
          <Select
            variant="inline"
            ariaLabel="지역 선택"
            options={REGION_OPTIONS}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        }
      />

      <Card flush>
        {branches.error ? (
          <ErrorState message={branches.error} onRetry={branches.reload} />
        ) : branches.loading ? (
          <SkeletonRows rows={8} label={`${title} 불러오는 중`} />
        ) : stores.length === 0 ? (
          <EmptyState
            title={filteredOut ? '이 지역에는 해당 점포가 없습니다' : '표시할 점포가 없습니다'}
            description={
              filteredOut
                ? '지역을 전국으로 바꿔 보세요.'
                : '점포가 운영보고서를 제출하면 목록이 채워집니다.'
            }
          />
        ) : (
          <StoreList
            stores={stores}
            ranked={!showRisk}
            onSelect={(store) => navigate(`/enterprise/stores/${store.id}/reports`)}
          />
        )}
      </Card>
    </PageContainer>
  )
}

export default StoreDirectoryPage
