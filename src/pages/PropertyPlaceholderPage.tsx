import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PageHeading from '../components/layout/PageHeading'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { EmptyState } from '../components/ui/StateView'

/**
 * 추천 입지에서 연결되는 실제 매물 화면의 자리표시자.
 *
 * candidateId는 query로, 기존 링크와의 호환을 위해 route parameter로도
 * 받을 수 있게 해 둔다. 실제 매물 API가 연결되면 이 식별자를 그대로
 * 조회 조건에 사용할 수 있다.
 */
function PropertyPlaceholderPage() {
  const navigate = useNavigate()
  const { candidateId: routeCandidateId } = useParams<{ candidateId?: string }>()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId') ?? routeCandidateId

  return (
    <PageContainer width="narrow">
      <PageHeading
        title={candidateId ? '선택한 입지의 매물 안내' : '부동산 매물 안내'}
        subtitle="추천 입지와 연결된 실제 매물 정보를 확인하는 화면입니다."
      />

      <Card>
        <EmptyState
          size="page"
          title="실제 매물 페이지로 연결될 예정입니다"
          description="현재 프로젝트에서는 실제 부동산 매물 데이터 연동 기능은 구현 대상이 아닙니다. 추후 선택한 추천 입지에 맞는 매물 서비스로 연결됩니다."
          action={
            <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
              추천 결과로 돌아가기
            </Button>
          }
        />
      </Card>
    </PageContainer>
  )
}

export default PropertyPlaceholderPage

