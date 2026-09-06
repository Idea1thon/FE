import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import FinancialReportForm from '../../components/domain/FinancialReportForm'
import { currentStore } from '../../data/mock'

const PERIOD_OPTIONS = [
  { value: '2026-08', label: '2026년 08월' },
  { value: '2026-07', label: '2026년 07월' },
  { value: '2026-06', label: '2026년 06월' },
]

/** 재무제표 보고서 생성 — POS 자료 불러오기 + 항목별 입력 폼. */
function FinancialReportFormPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0].value)
  const [values, setValues] = useState<Record<string, string>>({})

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const loadFromPos = () => {
    // POS 연동 자리 — 실제 구현 시 불러온 값으로 setValues.
  }

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? ''

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        backTo="/owner/reports"
        eyebrow={`${currentStore.region} · ${currentStore.name}`}
        title={`${periodLabel} 운영보고서`}
        subtitle="입력한 값으로 위험도 분석이 계산됩니다. 모르는 항목은 비워 두어도 됩니다."
        actions={
          <>
            <Select
              variant="inline"
              ariaLabel="보고서 기간"
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <Button variant="secondary" size="md" onClick={loadFromPos}>
              POS 자료 불러오기
            </Button>
            <Button size="md" onClick={() => navigate('/owner/reports')}>
              보고서 생성
            </Button>
          </>
        }
      />

      <FinancialReportForm values={values} onChange={setValue} />

      {/* 항목이 길어 하단에서도 바로 제출할 수 있게 한 번 더 둔다. */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" size="lg" onClick={() => navigate('/owner/reports')}>
          취소
        </Button>
        <Button size="lg" onClick={() => navigate('/owner/reports')}>
          보고서 생성
        </Button>
      </div>
    </PageContainer>
  )
}

export default FinancialReportFormPage
