import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Select from '../../components/ui/Select'
import ReportList from '../../components/domain/ReportList'
import { getStore, operationReports, SORT_OPTIONS } from '../../data/mock'

/** 점포 운영보고서 목록 (기업 로그인 — 읽기 전용). */
function StoreReportsPage() {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const store = getStore(storeId)
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        title={`${store.region} | ${store.name} 운영보고서`}
        subtitle={store.manager}
        actions={
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        }
      />
      <ReportList
        reports={operationReports}
        variant="enterprise"
        onOpen={(report) =>
          navigate(`/enterprise/stores/${store.id}/reports/${report.id}`)
        }
      />
    </PageContainer>
  )
}

export default StoreReportsPage
