import type { LocationRecommendationResult } from '../../api'

interface LocationResultListProps {
  result: LocationRecommendationResult
}

/** 후보 하나에서 화면에 쓸 값만 뽑는다. 구조는 추천 서비스가 정본이라 방어적으로 읽는다. */
interface CandidateView {
  id: string
  rank: number
  title: string
  detail: string
  tier: string | null
  reasons: string[]
  cautions: string[]
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function strings(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string' && !!v.trim()).slice(0, limit)
}

function toView(raw: Record<string, unknown>, index: number): CandidateView {
  const location = (raw.location ?? {}) as Record<string, unknown>
  const anchor = (location.anchor ?? {}) as Record<string, unknown>

  const place = text(location.place_name) ?? text(anchor.name)
  const address =
    text(location.building_address) ??
    text(location.address_point) ??
    text(anchor.lot_address)

  // location.sido/sigungu 는 **요청한 지역**이고 admin_dong 은 후보의 실제 동이다.
  // 둘을 이어 붙이면 "강남구 서초4동" 처럼 존재하지 않는 주소가 만들어진다.
  // 후보의 위치는 주소 필드만 신뢰한다.
  const title = place ?? address ?? `후보 ${index + 1}`
  const detail = address && address !== title ? address : (text(location.admin_dong) ?? '')

  return {
    id: text(raw.candidate_id) ?? `candidate-${index}`,
    rank: index + 1,
    title,
    detail,
    tier: text(raw.fit_tier),
    reasons: strings(raw.reasons, 3),
    cautions: [...strings(raw.counter_evidence, 2), ...strings(raw.context_notes, 1)],
  }
}

/** 신규 점포 입지 분석 결과 목록. */
function LocationResultList({ result }: LocationResultListProps) {
  const candidates = result.candidates.map(toView)

  if (candidates.length === 0) {
    return (
      <p className="m-0 text-[18px] text-w-placeholder">
        조건에 맞는 후보를 찾지 못했습니다. 지역이나 조건을 바꿔 다시 검색해 보세요.
      </p>
    )
  }

  return (
    <>
      <p className="m-0 text-[16px] text-w-placeholder">
        후보 {candidates.length}곳
        {/* LLM 없이 규칙 기반으로 설명이 만들어진 경우를 숨기지 않는다. */}
        {result.explanations?.degraded === true && ' · 설명은 규칙 기반으로 생성되었습니다'}
      </p>

      <ul className="list-none m-0 p-0">
        {candidates.map((c) => (
          <li key={c.id} className="border-t border-w-line first:border-t-0">
            <div className="flex flex-col gap-3.5 w-full px-1 py-6 text-left text-w-ink">
              <span className="flex items-baseline gap-3">
                <span className="flex-none text-[18px] text-w-placeholder lg:text-[22px]">
                  {c.rank}
                </span>
                <span className="text-[22px] font-medium lg:text-[28px]">{c.title}</span>
                {c.tier && (
                  <span className="flex-none px-2 py-0.5 text-[14px] border border-w-line rounded-md">
                    {c.tier}
                  </span>
                )}
              </span>

              {c.detail && <span className="text-[18px]">{c.detail}</span>}

              {c.reasons.length > 0 && (
                <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                  {c.reasons.map((r, i) => (
                    <li key={i} className="text-[17px] leading-[1.5]">
                      · {r}
                    </li>
                  ))}
                </ul>
              )}

              {/* 반대 근거를 같이 보여준다. 추천만 나열하면 판단 근거가 한쪽으로 기운다. */}
              {c.cautions.length > 0 && (
                <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                  {c.cautions.map((r, i) => (
                    <li key={i} className="text-[16px] leading-[1.5] text-w-placeholder">
                      · {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default LocationResultList
