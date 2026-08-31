import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import StoreSearchCard from '../components/domain/StoreSearchCard'
import LocationResultList from '../components/domain/LocationResultList'
import { locationResults } from '../data/mock'

/** 신규 점포 입지 분석 — 기업/사업자 공통 화면. */
function LocationAnalysisPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <StoreSearchCard onSearch={() => undefined} />
        <LocationResultList
          results={locationResults}
          onSelect={(result) => navigate(`/property/${result.id}`)}
        />
      </div>
    </PageContainer>
  )
}

export default LocationAnalysisPage
