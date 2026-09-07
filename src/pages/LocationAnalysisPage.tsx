import { useCallback, useRef, useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import PageHeading from '../components/layout/PageHeading'
import StoreSearchCard from '../components/domain/StoreSearchCard'
import type { LocationSearchInput } from '../components/domain/StoreSearchCard'
import LocationResultList from '../components/domain/LocationResultList'
import Card from '../components/ui/Card'
import { EmptyState, ErrorState, WorkingState } from '../components/ui/StateView'
import * as api from '../api'

/**
 * 신규 점포 입지 분석 — 기업/사업자 공통.
 *
 * 서버는 200(결과) 또는 202(run_ticket)를 준다. 파이프라인이 오래 걸리면 브라우저를
 * 세워둘 수 없어 202 로 끊고 폴링하게 되어 있다. 티켓은 해석하지 않고 그대로 되돌린다.
 * (호출·폴링 로직은 변경 없음.)
 *
 * 화면은 네 상태를 모두 명시한다 — 시작 전 / 분석 중(경과 초 포함) / 실패(재시도) /
 * 결과. DESIGN.md §1 이 요구하는 "명시적 상태 + 다음 안전한 행동"이다.
 */
function LocationAnalysisPage() {
  const [result, setResult] = useState<api.LocationRecommendationResult | null>(null)
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // 이전 요청의 폴링이 새 요청 결과를 덮어쓰지 않게 한다.
  const runSeq = useRef(0)
  // 재시도 버튼이 마지막 조건을 그대로 다시 보낼 수 있게 보관한다.
  const lastInput = useRef<LocationSearchInput | null>(null)

  const poll = useCallback(async (ticket: string, seq: number, waited: number) => {
    if (seq !== runSeq.current) return
    try {
      const reply = await api.pollLocationRecommendation(ticket)
      if (seq !== runSeq.current) return
      if (reply.done) {
        setResult(reply.result)
        setStatus(null)
        setPending(false)
        return
      }
      const next = waited + reply.pending.retry_after
      setStatus(`${next}초 경과`)
      setTimeout(() => poll(ticket, seq, next), reply.pending.retry_after * 1000)
    } catch (cause) {
      if (seq !== runSeq.current) return
      setError(cause instanceof api.ApiError ? cause.message : '결과를 가져오지 못했습니다')
      setStatus(null)
      setPending(false)
    }
  }, [])

  const search = async (input: LocationSearchInput) => {
    const seq = ++runSeq.current
    lastInput.current = input
    setPending(true)
    setError(null)
    setResult(null)
    setStatus('분석을 시작했습니다')

    try {
      const reply = await api.requestLocationRecommendation({
        region_code: input.regionCode,
        business_category_code: input.businessCategoryCode || undefined,
        special_condition_text: input.conditionText,
        limit: 5,
      })
      if (seq !== runSeq.current) return
      if (reply.done) {
        setResult(reply.result)
        setStatus(null)
        setPending(false)
      } else {
        setStatus('잠시만 기다려 주세요')
        setTimeout(() => poll(reply.pending.run_ticket, seq, 0), reply.pending.retry_after * 1000)
      }
    } catch (cause) {
      if (seq !== runSeq.current) return
      setError(cause instanceof api.ApiError ? cause.message : '추천 요청에 실패했습니다')
      setStatus(null)
      setPending(false)
    }
  }

  // 에러 화면은 검색을 한 번이라도 시도한 뒤에만 나타나므로 `lastInput` 은 이미
  // 채워져 있다. 렌더 중에 ref 를 읽지 않도록 조건 없이 넘기고, 핸들러 안에서 확인한다.
  const retry = () => {
    if (lastInput.current) void search(lastInput.current)
  }

  return (
    <PageContainer>
      <PageHeading
        title="신규 점포 입지 분석"
        subtitle="지역·업종과 조건을 입력하면 후보지와 그 근거를 정리해 보여줍니다."
      />

      <div className="flex flex-col gap-6">
        <StoreSearchCard onSearch={search} pending={pending} />

        {error && (
          <Card>
            <ErrorState message={error} onRetry={retry} />
          </Card>
        )}

        {status && !error && (
          <Card>
            <WorkingState
              title="입지를 분석하고 있습니다"
              description={`인구·매출·경쟁·계획 데이터를 함께 확인하는 중입니다. ${status}`}
            />
          </Card>
        )}

        {result && <LocationResultList result={result} />}

        {!result && !status && !error && (
          <Card>
            <EmptyState
              size="page"
              title="아직 분석한 지역이 없습니다"
              description="위에서 시·군·구까지 선택하고 분석을 시작해 보세요. 행정동과 업종은 선택 사항입니다."
            />
          </Card>
        )}
      </div>
    </PageContainer>
  )
}

export default LocationAnalysisPage
