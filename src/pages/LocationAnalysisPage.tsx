import { useCallback, useRef, useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import StoreSearchCard from '../components/domain/StoreSearchCard'
import type { LocationSearchInput } from '../components/domain/StoreSearchCard'
import LocationResultList from '../components/domain/LocationResultList'
import * as api from '../api'

/**
 * 신규 점포 입지 분석 — 기업/사업자 공통.
 *
 * 서버는 200(결과) 또는 202(run_ticket)를 준다. 파이프라인이 오래 걸리면 브라우저를
 * 세워둘 수 없어 202 로 끊고 폴링하게 되어 있다. 티켓은 해석하지 않고 그대로 되돌린다.
 */
function LocationAnalysisPage() {
  const [result, setResult] = useState<api.LocationRecommendationResult | null>(null)
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // 이전 요청의 폴링이 새 요청 결과를 덮어쓰지 않게 한다.
  const runSeq = useRef(0)

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
      setStatus(`분석 중… ${next}초 경과`)
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
    setPending(true)
    setError(null)
    setResult(null)
    setStatus('분석을 시작했습니다…')

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
        setStatus('분석 중… 잠시만 기다려 주세요')
        setTimeout(() => poll(reply.pending.run_ticket, seq, 0), reply.pending.retry_after * 1000)
      }
    } catch (cause) {
      if (seq !== runSeq.current) return
      setError(cause instanceof api.ApiError ? cause.message : '추천 요청에 실패했습니다')
      setStatus(null)
      setPending(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <StoreSearchCard onSearch={search} pending={pending} />

        {error && (
          <p role="alert" className="m-0 text-[18px] text-w-ink">
            {error}
          </p>
        )}

        {status && (
          <p className="m-0 text-[18px] text-w-placeholder" aria-live="polite">
            {status}
          </p>
        )}

        {result && <LocationResultList result={result} />}

        {!result && !status && !error && (
          <p className="m-0 text-[18px] text-w-placeholder">
            지역과 업종을 고르고 검색하면 추천 입지가 나옵니다.
          </p>
        )}
      </div>
    </PageContainer>
  )
}

export default LocationAnalysisPage
