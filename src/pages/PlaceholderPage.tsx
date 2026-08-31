import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'

interface PlaceholderPageProps {
  /** Name of the destination the wireframe only references (부동산 매물, 금융 상품 …). */
  title: string
}

/** Stand-in for pages that the 아이디어1톤 file only points to via annotations. */
function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate()
  return (
    <PageContainer width="narrow">
      <div className="flex flex-col items-start gap-4 py-10">
        <h1 className="text-[30px]">{title}</h1>
        <p className="text-[18px] text-w-placeholder">이 화면은 아직 디자인되지 않았습니다.</p>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </div>
    </PageContainer>
  )
}

export default PlaceholderPage
