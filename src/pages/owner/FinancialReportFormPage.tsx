import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import FinancialReportForm from '../../components/domain/FinancialReportForm'
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
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let active = true
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
  }, [])

  const setValue = (fieldCode: string, value: string) => {
    setValues((previous) => ({ ...previous, [fieldCode]: value }))
    setError(null)
    setNotice(null)
  }

  const handleSubmit = async () => {
    setError(null)
    setNotice(null)

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

  return (
    <PageContainer className="pb-0! lg:pb-0!">
      <PageHeading
        size="lg"
        title={`${
          PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? ''
        } 운영보고서 작성`}
        subtitle={
          <Select
            variant="inline"
            ariaLabel="보고서 기간"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            disabled={submitting}
          />
        }
        actions={
          <Button disabled={loading || submitting || fields.length === 0} onClick={handleSubmit}>
            {submitting ? '저장·분석 요청 중…' : '운영보고서 저장 및 분석 요청'}
          </Button>
        }
      />

      {error && (
        <p role="alert" className="mb-5 border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-5 border border-w-line bg-w-panel px-4 py-3 text-[15px] text-w-ink">{notice}</p>
      )}

      <Card
        title="운영보고서 입력"
        action={
          <span className="text-[14px] text-w-placeholder">
            {loading ? '백엔드 항목 불러오는 중…' : `${fields.length}개 항목 · * 필수`}
          </span>
        }
      >
        {loading ? (
          <p className="py-8 text-center text-[16px] text-w-placeholder">입력 항목을 불러오는 중입니다…</p>
        ) : fields.length === 0 ? (
          <p className="py-8 text-center text-[16px] text-w-placeholder">입력할 항목이 없습니다.</p>
        ) : (
          <FinancialReportForm
            fields={fields}
            values={values}
            onChange={setValue}
            disabled={submitting}
          />
        )}
      </Card>

      <p className="py-5 text-[14px] leading-[1.6] text-w-placeholder">
        저장하면 보고서는 먼저 <strong>ANALYZING</strong> 상태로 생성되고, 위험 사이렌이 켜진
        환경에서는 백그라운드 분석 후 결과와 앱 내 알림이 갱신됩니다. 금액은 원 단위의 0 이상
        정수로 입력합니다.
      </p>
    </PageContainer>
  )
}

export default FinancialReportFormPage
