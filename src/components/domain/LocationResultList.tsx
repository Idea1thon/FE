import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { EmptyState } from '../ui/StateView'
import type { LocationRecommendationResult } from '../../api'
import { Link } from 'react-router-dom'
import { toFriendlyLocationEvidence } from '../../utils/locationEvidence'

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
  return value
    .filter((v): v is string => typeof v === 'string' && !!v.trim())
    .map(toFriendlyLocationEvidence)
    .filter((v): v is string => Boolean(v))
    .slice(0, limit)
}

function propertyPath(candidateId: string, runId: string): string {
  const params = new URLSearchParams({ candidateId })
  if (runId) params.set('runId', runId)
  return `/property?${params.toString()}`
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
    tier: toFriendlyLocationEvidence(text(raw.fit_tier) ?? ''),
    reasons: strings(raw.reasons, 3),
    cautions: [...strings(raw.counter_evidence, 2), ...strings(raw.context_notes, 1)],
  }
}

/** 등급 문자열을 배지 톤으로. 알 수 없는 값은 중립으로 둔다 — 색으로 단정하지 않는다. */
function tierTone(tier: string): 'primary' | 'safe' | 'warn' | 'neutral' {
  if (tier.includes('적합') && !tier.includes('부적합')) return 'primary'
  if (tier.includes('우수') || tier.includes('추천')) return 'safe'
  if (tier.includes('조건부') || tier.includes('검토')) return 'warn'
  return 'neutral'
}

/**
 * 신규 점포 입지 분석 결과 목록.
 *
 * 각 후보는 순위 · 위치 · 등급을 한 줄로 먼저 보여주고, 그 아래에 관측 근거와
 * 유의할 점을 나눠 싣는다. DESIGN.md §1 의 "value first" 를 따르되 반대 근거를
 * 같은 카드 안에 남긴다 — 추천만 나열하면 판단 근거가 한쪽으로 기운다.
 */
function LocationResultList({ result }: LocationResultListProps) {
  const candidates = result.candidates.map(toView)

  if (candidates.length === 0) {
    return (
      <Card>
        <EmptyState
          title="조건에 맞는 후보를 찾지 못했습니다"
          description="행정동을 비우거나 업종·추가 조건을 넓혀 다시 검색해 보세요."
        />
      </Card>
    )
  }

  const degraded = result.explanations?.degraded === true

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h3 text-fg">
          추천 입지 <span className="num text-primary">{candidates.length}</span>곳
        </h2>
        {/* LLM 없이 규칙 기반으로 설명이 만들어진 경우를 숨기지 않는다. */}
        {degraded && (
          <Badge tone="warn" size="sm">
            설명은 규칙 기반으로 생성됨
          </Badge>
        )}
      </div>

      <ul className="flex list-none flex-col gap-4 p-0">
        {candidates.map((c) => (
          <li key={c.id}>
            <Link
              to={propertyPath(c.id, result.run_id)}
              aria-label={`${c.title} 관련 매물 안내 보기`}
              className="group block rounded-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <article className="flex flex-col gap-4 rounded-panel border border-line bg-canvas p-5 transition-colors duration-150 group-hover:border-primary group-focus-visible:border-primary lg:p-6">
                <header className="flex items-start gap-4">
                  <span
                    className="num flex size-9 flex-none items-center justify-center rounded-ctl-md bg-weak text-[15px] font-bold text-weak-fg"
                    aria-hidden="true"
                  >
                    {c.rank}
                  </span>
                  <div className="min-w-0 flex-auto">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-h4 text-fg">
                        <span className="sr-only">{c.rank}위 후보 </span>
                        {c.title}
                      </h3>
                      {c.tier && (
                        <Badge tone={tierTone(c.tier)} size="sm">
                          {c.tier}
                        </Badge>
                      )}
                    </div>
                    {c.detail && <p className="mt-1 text-bodysm text-muted">{c.detail}</p>}
                  </div>
                </header>

                {c.reasons.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-bodysm font-semibold text-body">관측된 근거</p>
                    <ul className="flex list-none flex-col gap-2 p-0">
                      {c.reasons.map((r, i) => (
                        <li key={i} className="flex gap-2 text-body">
                          <span className="mt-2 size-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {c.cautions.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-ctl-md bg-surface p-4">
                    <p className="text-bodysm font-semibold text-body">함께 볼 점</p>
                    <ul className="flex list-none flex-col gap-2 p-0">
                      {c.cautions.map((r, i) => (
                        <li key={i} className="flex gap-2 text-bodysm text-muted">
                          <span className="mt-1.5 size-1.5 flex-none rounded-full bg-muted" aria-hidden="true" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 border-t border-line pt-3 text-bodysm font-semibold text-primary">
                  <span>관련 매물 확인</span>
                  <span aria-hidden="true" className="text-[20px] leading-none transition-transform duration-150 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LocationResultList
