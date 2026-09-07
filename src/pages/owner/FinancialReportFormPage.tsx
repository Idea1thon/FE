import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import FinancialReportForm from '../../components/domain/FinancialReportForm'
import Skeleton from '../../components/ui/Skeleton'
import { EmptyState, ErrorState } from '../../components/ui/StateView'
import { ApiError, fetchInputFields, submitReport } from '../../api'
import type { InputFieldItem } from '../../api'

const PERIOD_OPTIONS = [
  { value: '2026-09', label: '2026년 09월' },
  { value: '2026-08', label: '2026년 08월' },
  { value: '2026-07', label: '2026년 07월' },
  { value: '2026-06', label: '2026년 06월' },
  { value: '2026-03', label: '2026년 03월 · 데모 이벤트 기준' },
]

function formatApiError(cause: unknown) {
  return cause instanceof ApiError ? cause.message : '운영보고서 항목을 불러오지 못했습니다.'
}

function parseAmount(value: string) {
  const normalized = value.replaceAll(',', '').trim()
  if (!/^\d+$/.test(normalized)) return null
  const amount = Number(normalized)
  return Number.isSafeInteger(amount) && amount >= 0 ? amount : null
}

/** 재무제표 보고서 생성 — 백엔드 항목 조회·저장·분석 요청까지 연결한다. */
function FinancialReportFormPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0].value)
  const [fields, setFields] = useState<InputFieldItem[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadNonce, setLoadNonce] = useState(0)

  useEffect(() => {
    let active = true
    // `setLoading(true)` 는 재시도 핸들러에서 처리한다 — 효과 안에서 동기적으로
    // setState 하면 불필요한 렌더가 한 번 더 돈다.
    fetchInputFields()
      .then((response) => {
        if (!active) return
        setFields(response.items)
        setError(null)
      })
      .catch((cause: unknown) => {
        if (active) setError(formatApiError(cause))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [loadNonce])

  const setValue = (fieldCode: string, value: string) => {
    setValues((previous) => ({ ...previous, [fieldCode]: value }))
    setError(null)
  }

  const handleSubmit = async () => {
    setError(null)

    const missing = fields
      .filter((field) => field.is_required && !values[field.code]?.trim())
      .map((field) => field.name)
    if (missing.length > 0) {
      setError(`필수 항목을 입력해 주세요: ${missing.join(', ')}`)
      return
    }

    const invalid = fields.find((field) => {
      const raw = values[field.code]
      return raw !== undefined && raw.trim() !== '' && parseAmount(raw) === null
    })
    if (invalid) {
      setError(`${invalid.name}은(는) 0 이상의 정수 금액으로 입력해 주세요.`)
      return
    }

    const items = fields
      .filter((field) => values[field.code]?.trim())
      .map((field) => ({
        field_code: field.code,
        amount: parseAmount(values[field.code]) ?? 0,
      }))

    setSubmitting(true)
    try {
      const response = await submitReport({
        report_month: period,
        input_source: 'MANUAL',
        items,
      })
      navigate(`/owner/reports/${response.report_id}`)
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : '운영보고서를 저장하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? ''
  const requiredCount = fields.filter((f) => f.is_required).length
  const noFields = !loading && fields.length === 0

  const reloadFields = () => {
    setLoading(true)
    setLoadNonce((n) => n + 1)
  }

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        backTo="/owner/reports"
        title={`${periodLabel} 운영보고서 작성`}
        subtitle="저장하면 위험도 분석이 백그라운드로 실행됩니다. 금액은 원 단위 0 이상 정수입니다."
        actions={
          <>
            <Select
              variant="inline"
              ariaLabel="보고서 기간"
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              disabled={submitting}
            />
            <Button
              size="md"
              loading={submitting}
              disabled={loading || noFields}
              onClick={handleSubmit}
            >
              저장 및 분석 요청
            </Button>
          </>
        }
      />

      {/* 검증·저장 실패는 폼 위에 둔다 — 아래에 두면 스크롤 밖으로 밀린다. */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-ctl-md border border-danger bg-danger/5 px-4 py-3 text-bodysm text-danger"
        >
          {error}
        </div>
      )}

      {loading ? (
        <Card title="운영보고서 입력">
          <div className="flex flex-col gap-3" role="status" aria-live="polite">
            <span className="sr-only">입력 항목을 불러오는 중</span>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-40 rounded-xs" />
                <Skeleton className="h-10 w-[132px] rounded-ctl-sm" />
              </div>
            ))}
          </div>
        </Card>
      ) : noFields ? (
        <Card flush>
          {error ? (
            <ErrorState message={error} onRetry={reloadFields} />
          ) : (
            <EmptyState
              title="입력할 항목이 없습니다"
              description="서버에서 내려주는 입력 항목이 비어 있습니다. 잠시 후 다시 시도해 주세요."
            />
          )}
        </Card>
      ) : (
        <>
          <p className="mb-4 text-bodysm text-muted">
            <span className="num font-semibold text-body">{fields.length}</span>개 항목 · 필수{' '}
            <span className="num font-semibold text-body">{requiredCount}</span>개(
            <span className="text-danger">*</span>)
          </p>
          <FinancialReportForm
            fields={fields}
            values={values}
            onChange={setValue}
            disabled={submitting}
          />
          {/* 항목이 길어 하단에서도 바로 제출할 수 있게 한 번 더 둔다. */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              size="lg"
              disabled={submitting}
              onClick={() => navigate('/owner/reports')}
            >
              취소
            </Button>
            <Button size="lg" loading={submitting} onClick={handleSubmit}>
              저장 및 분석 요청
            </Button>
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default FinancialReportFormPage
