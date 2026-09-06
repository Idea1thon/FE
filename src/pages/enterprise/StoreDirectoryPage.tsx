import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Select from '../../components/ui/Select'
import StoreList from '../../components/domain/StoreList'
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

  return (
    <PageContainer>
      <PageHeading
        title={title}
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

      {branches.error && (
        <p role="alert" className="mb-5 border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
          {branches.error}
        </p>
      )}
      {branches.loading ? (
        <p className="border border-w-line bg-w-panel px-6 py-8 text-center text-[16px] text-w-placeholder">
          점포 목록을 불러오는 중입니다…
        </p>
      ) : stores.length === 0 ? (
        <p className="border border-w-line bg-w-panel px-6 py-8 text-center text-[16px] text-w-placeholder">
          표시할 점포가 없습니다.
        </p>
      ) : (
        <StoreList
          stores={stores}
          onSelect={(store) => navigate(`/enterprise/stores/${store.id}/reports`)}
        />
      )}
    </PageContainer>
  )
}

export default StoreDirectoryPage
