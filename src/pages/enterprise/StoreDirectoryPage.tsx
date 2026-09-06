import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import StoreList from '../../components/domain/StoreList'
import { EmptyState } from '../../components/ui/StateView'
import { REGION_OPTIONS } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'

interface StoreDirectoryPageProps {
  title: string
  stores: StoreSummary[]
}

/** 매출 TOP 점포 랭킹 / 집중 관리 필요 점포 전체 목록 (기업 로그인). */
function StoreDirectoryPage({ title, stores }: StoreDirectoryPageProps) {
  const navigate = useNavigate()
  const [region, setRegion] = useState(REGION_OPTIONS[0].value)

  return (
    <PageContainer>
      <PageHeading
        title={title}
        backTo="/enterprise"
        meta={<span className="num">{stores.length}곳</span>}
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
        {stores.length === 0 ? (
          <EmptyState title="표시할 점포가 없습니다" />
        ) : (
          <StoreList
            stores={stores}
            onSelect={(store) => navigate(`/enterprise/stores/${store.id}/reports`)}
          />
        )}
      </Card>
    </PageContainer>
  )
}

export default StoreDirectoryPage
