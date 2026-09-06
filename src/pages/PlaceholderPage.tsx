import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { EmptyState } from '../components/ui/StateView'

interface PlaceholderPageProps {
  /** Name of the destination the wireframe only references (부동산 매물, 금융 상품 …). */
  title: string
}

/** Stand-in for pages the wireframe only points to via annotations. */
function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate()
  return (
    <PageContainer width="narrow">
      <Card>
        <EmptyState
          size="page"
          title={`${title}는 아직 준비 중입니다`}
          description="화면이 연결되면 여기에서 바로 확인할 수 있습니다."
          action={
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              이전 화면으로
            </Button>
          }
        />
      </Card>
    </PageContainer>
  )
}

export default PlaceholderPage
