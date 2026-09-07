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
  addressSource: string | null
  candidateType: string | null
  spatialGrain: string | null
  precision: string | null
  confidence: string | null
  hostArea: string | null
  coordinateLabel: string
  coordinate: string | null
  fitIndex: number | null
  scoreIsPredictive: boolean
  entryHealth: string | null
  nearbyAnchors: string[]
  evidence: string[]
  summary: string | null
  tier: string | null
  reasons: string[]
  cautions: string[]
  contextNotes: string[]
  missingFeatures: string[]
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function finiteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string' || !value.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 4 }).format(value)
}

function strings(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((v) => (typeof v === 'string' ? v : text(record(v).reason)))
    .filter((v): v is string => Boolean(v?.trim()))
    .map((v) => toFriendlyLocationEvidence(v))
    .filter((v): v is string => Boolean(v))
    .slice(0, limit)
}

function friendlyCandidateType(value: string | null): string | null {
  if (!value) return null
  const labels: Record<string, string> = {
    아파트단지_인근: '아파트 인근',
    역_인근: '역 인근',
    카카오POI_인근: '주변 장소 인근',
    상가건물_인근: '상업용 건물 기준',
    생성지점_격자: '생성 좌표',
    매물: '실제 매물',
  }
  return labels[value] ?? value
}

function friendlySpatialGrain(value: string | null): string | null {
  if (!value) return null
  const labels: Record<string, string> = {
    지점: '지점 기준',
    '지점(생성)': '생성 좌표 기준',
    상권: '상권 기준',
    상권배후지: '상권 배후지 기준',
    행정동: '행정동 기준',
    개별매물: '개별 매물 기준',
  }
  return labels[value] ?? value
}

function friendlyPrecision(value: string | null): string | null {
  if (!value) return null
  if (value === '지점') return '앵커 지점'
  if (value === '지점(생성)') return '생성 지점'
  if (value === '매물주소') return '매물 주소'
  return value
}

function friendlyConfidence(value: string | null): string | null {
  if (!value) return null
  const labels: Record<string, string> = { high: '높음', medium: '중간', low: '낮음' }
  return labels[value.toLowerCase()] ?? value
}

function addressSourceLabel(value: string | null): string | null {
  if (!value) return null
  const labels: Record<string, string> = {
    listing: '매물 주소',
    reverse_geocode: '역지오코딩 주소',
    '도로명주소(Tier2)': '도로명주소',
    '지번주소(Tier1)': '지번주소',
  }
  return labels[value] ?? value
}

function nearbyAnchorStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      const anchor = record(item)
      const name = text(anchor.name)
      if (!name) return null
      const type = text(anchor.type)
      const distance = finiteNumber(anchor.distance_m)
      return `${name}${type ? ` · ${type}` : ''}${distance !== null ? ` · ${formatNumber(distance)}m` : ''}`
    })
    .filter((value): value is string => Boolean(value))
    .slice(0, 3)
}

function evidenceStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      const evidence = record(item)
      const metric = text(evidence.metric_name)
      if (!metric) return null
      const numericValue = finiteNumber(evidence.value)
      const displayValue =
        numericValue !== null
          ? formatNumber(numericValue)
          : text(evidence.value) ?? toFriendlyLocationEvidence(text(evidence.missing_reason) ?? '미확인')
      const unit = text(evidence.unit)
      const grain = text(evidence.spatial_grain)
      const period = text(evidence.period)
      const proxy = evidence.grain_is_proxy === true ? ' · 대리 지표' : ''
      return `${metric}: ${displayValue ?? '미확인'}${unit ? ` ${unit}` : ''}${grain ? ` · ${grain}` : ''}${period ? ` · ${period}` : ''}${proxy}`
    })
    .filter((value): value is string => Boolean(value))
    .slice(0, 6)
}

function propertyPath(candidateId: string, runId: string): string {
  const params = new URLSearchParams({ candidateId })
  if (runId) params.set('runId', runId)
  return `/property?${params.toString()}`
}

function toView(
  raw: Record<string, unknown>,
  index: number,
  explanation?: Record<string, unknown>,
): CandidateView {
  const location = record(raw.location)
  const anchor = record(location.anchor)
  const buildingAddress = record(location.building_address)
  const addressPoint = record(location.address_point)
  const point = record(location.point)
  const hostCommercialArea = record(location.host_commercial_area)
  const dataConfidence = record(raw.data_confidence)
  const dimensionEvidence = record(raw.dimension_evidence)
  const entryHealthDimension = record(dimensionEvidence['진입건전성'])
  const entryHealth = record(entryHealthDimension.entry_health_v1)

  const place = text(location.place_name) ?? text(anchor.name)
  const address =
    text(buildingAddress.value) ??
    text(addressPoint.road_address) ??
    text(anchor.lot_address)
  const addressSource = addressSourceLabel(text(buildingAddress.source) ?? text(addressPoint.source_type))

  // location.sido/sigungu 는 **요청한 지역**이고 admin_dong 은 후보의 실제 동이다.
  // 둘을 이어 붙이면 "강남구 서초4동" 처럼 존재하지 않는 주소가 만들어진다.
  // 후보의 위치는 주소 필드만 신뢰한다.
  const title = place ?? address ?? `후보 ${index + 1}`
  const detail = address && address !== title ? address : (text(location.admin_dong) ?? '')
  const pointX = finiteNumber(point.x) ?? finiteNumber(addressPoint.lon)
  const pointY = finiteNumber(point.y) ?? finiteNumber(addressPoint.lat)
  const pointCrs = text(point.crs) ?? (pointX !== null && pointY !== null ? 'WGS84' : null)
  const coordinate =
    pointX !== null && pointY !== null
      ? `${formatNumber(pointX)}, ${formatNumber(pointY)}${pointCrs ? ` (${pointCrs})` : ''}`
      : null
  const hostName = text(hostCommercialArea.name) ?? text(hostCommercialArea.code)
  const hostRelation = text(hostCommercialArea.relation)
  const hostDistance = finiteNumber(hostCommercialArea.distance_m)
  const hostArea = hostName
    ? `${hostName}${hostRelation ? ` · ${hostRelation}` : ''}${hostDistance !== null ? ` · ${formatNumber(hostDistance)}m` : ''}`
    : null

  return {
    id: text(raw.candidate_id) ?? `candidate-${index}`,
    rank: index + 1,
    title,
    detail,
    addressSource,
    candidateType: friendlyCandidateType(text(raw.candidate_type)),
    spatialGrain: friendlySpatialGrain(text(raw.spatial_grain)),
    precision: friendlyPrecision(text(location.precision)),
    confidence: friendlyConfidence(text(dataConfidence.level)),
    hostArea,
    coordinateLabel: point.crs ? '분석 기준 좌표' : '위치 좌표',
    coordinate,
    fitIndex: finiteNumber(raw.fit_index),
    scoreIsPredictive: raw.score_is_predictive === true,
    entryHealth: text(entryHealth.grade),
    nearbyAnchors: nearbyAnchorStrings(location.nearby_anchors),
    evidence: evidenceStrings(raw.evidence),
    summary: toFriendlyLocationEvidence(text(explanation?.summary) ?? ''),
    tier: toFriendlyLocationEvidence(text(raw.fit_tier) ?? ''),
    reasons: strings(raw.reasons, 3),
    cautions: strings(raw.counter_evidence, 3),
    contextNotes: strings(raw.context_notes, 3),
    missingFeatures: strings(raw.missing_features, 3),
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
  const explanationCards = Array.isArray(result.explanations?.cards)
    ? result.explanations.cards
        .map((card) => record(card))
        .filter((card) => Boolean(text(card.candidate_id)))
    : []
  const explanationByCandidateId = new Map(
    explanationCards.map((card) => [text(card.candidate_id) as string, card]),
  )
  const candidates = result.candidates.map((candidate, index) => {
    const candidateId = text(candidate.candidate_id) ?? `candidate-${index}`
    return toView(candidate, index, explanationByCandidateId.get(candidateId))
  })

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
                    {c.addressSource && c.detail && (
                      <p className="mt-1 text-[12px] text-muted">주소 기준: {c.addressSource}</p>
                    )}
                  </div>
                </header>

                {c.summary && (
                  <div className="rounded-ctl-md bg-weak p-4">
                    <p className="text-bodysm font-semibold text-body">추천 요약</p>
                    <p className="mt-1 text-body">{c.summary}</p>
                  </div>
                )}

                {(c.candidateType || c.spatialGrain || c.precision || c.confidence || c.hostArea || c.coordinate || c.fitIndex !== null || c.entryHealth) && (
                  <dl className="grid grid-cols-1 gap-3 rounded-ctl-md bg-surface p-4 lg:grid-cols-2">
                    {c.candidateType && (
                      <div>
                        <dt className="text-[12px] text-muted">후보 기준</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.candidateType}</dd>
                      </div>
                    )}
                    {c.spatialGrain && (
                      <div>
                        <dt className="text-[12px] text-muted">분석 단위</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.spatialGrain}</dd>
                      </div>
                    )}
                    {c.precision && (
                      <div>
                        <dt className="text-[12px] text-muted">위치 정밀도</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.precision}</dd>
                      </div>
                    )}
                    {c.confidence && (
                      <div>
                        <dt className="text-[12px] text-muted">데이터 신뢰도</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.confidence}</dd>
                      </div>
                    )}
                    {c.hostArea && (
                      <div>
                        <dt className="text-[12px] text-muted">참조 상권</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.hostArea}</dd>
                      </div>
                    )}
                    {c.fitIndex !== null && (
                      <div>
                        <dt className="text-[12px] text-muted">적합도 지수</dt>
                        <dd className="mt-1 text-bodysm text-body">
                          {formatNumber(c.fitIndex)}
                          {!c.scoreIsPredictive && <span className="ml-1 text-muted">(예측 점수 아님)</span>}
                        </dd>
                      </div>
                    )}
                    {c.entryHealth && (
                      <div>
                        <dt className="text-[12px] text-muted">진입 안정성</dt>
                        <dd className="mt-1 text-bodysm text-body">{c.entryHealth}</dd>
                      </div>
                    )}
                    {c.coordinate && (
                      <div className="lg:col-span-2">
                        <dt className="text-[12px] text-muted">{c.coordinateLabel}</dt>
                        <dd className="mt-1 break-all text-bodysm text-body">{c.coordinate}</dd>
                      </div>
                    )}
                  </dl>
                )}

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

                {c.evidence.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-bodysm font-semibold text-body">세부 관측값</p>
                    <ul className="flex list-none flex-col gap-2 p-0">
                      {c.evidence.map((item, i) => (
                        <li key={i} className="flex gap-2 text-bodysm text-muted">
                          <span className="mt-1.5 size-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                          <span>{item}</span>
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

                {c.contextNotes.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-ctl-md bg-surface p-4">
                    <p className="text-bodysm font-semibold text-body">지역 배경 정보</p>
                    <ul className="flex list-none flex-col gap-2 p-0">
                      {c.contextNotes.map((note, i) => (
                        <li key={i} className="flex gap-2 text-bodysm text-muted">
                          <span className="mt-1.5 size-1.5 flex-none rounded-full bg-muted" aria-hidden="true" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {c.missingFeatures.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-ctl-md border border-line bg-canvas p-4">
                    <p className="text-bodysm font-semibold text-body">추가 확인이 필요한 항목</p>
                    <ul className="flex list-none flex-col gap-2 p-0">
                      {c.missingFeatures.map((feature, i) => (
                        <li key={i} className="flex gap-2 text-bodysm text-muted">
                          <span className="mt-1.5 size-1.5 flex-none rounded-full bg-muted" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {c.nearbyAnchors.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-bodysm font-semibold text-body">주변 참고 지점</p>
                    <p className="text-bodysm text-muted">{c.nearbyAnchors.join(' · ')}</p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 border-t border-line pt-3 text-bodysm font-semibold text-primary">
                  <span>{c.candidateType === '실제 매물' ? '매물 상세 확인' : '이 위치의 매물 확인'}</span>
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
