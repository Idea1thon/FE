/**
 * Placeholder data mirroring the wireframe's "OOO / OO%" fillers.
 * Swap for a real API layer later — screens read only from here.
 */
import type { RiskLevel } from '../components/ui/RiskText'

export interface StoreSummary {
  id: string
  region: string // "서울 강남구"
  name: string // "OOO 교보타워점"
  manager: string // "홍길동 점장"
  /**
   * 우측에 표시할 값. 실제 API 목록에는 점장 이름이 없어(상세를 부르면 N+1)
   * 매출이나 위험도를 대신 보여준다. 비어 있으면 manager 를 쓴다.
   */
  trailing?: string
}

export interface LocationResult {
  id: string
  address: string // "서울시 OO구 OO동"
  detail: string // "자세한 주소"
  description: string // "점포 특성 설명"
}

export interface OperationReport {
  id: string
  period: string // "2026년 08월"
  riskPercent: string // "OO%"
  published: boolean // 공개 / 비공개
}

export interface Notification {
  id: string
  message: string
  time: string
}

export interface RiskSirenSignal {
  id: string
  label: string
  value: string
  detail: string
  score: number
  source: string
  synthetic: boolean
  level: RiskLevel
}

export interface RiskSirenEvent {
  eventId: string
  idempotencyKey: string
  branchId: string
  franchiseId: string
  brandName: string
  area: string
  industry: string
  evaluatedAt: string
  score: number
  grade: '위험'
  threshold: number
  policyVersion: string
  dispatchStatus: string
  recipients: string[]
  evidenceIds: string[]
  signals: RiskSirenSignal[]
  timeline: { time: string; label: string; detail: string; state: 'done' | 'current' }[]
  disclosure: string
}

export interface FinancialProduct {
  id: string
  name: string
  description: string
}

export const REGION_OPTIONS = [
  { value: 'nation', label: '전국' },
  { value: 'seoul', label: '서울특별시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'incheon', label: '인천광역시' },
]

export const DO_OPTIONS = [
  { value: '', label: 'OO도' },
  { value: 'seoul', label: '서울특별시' },
  { value: 'gyeonggi', label: '경기도' },
]

export const SI_OPTIONS = [
  { value: '', label: 'OO시' },
  { value: 'gangnam', label: '강남구' },
  { value: 'yongin', label: '용인시' },
]

export const DONG_OPTIONS = [
  { value: '', label: 'OO동' },
  { value: 'yeoksam', label: '역삼동' },
  { value: 'nonhyeon', label: '논현동' },
]

export const SORT_OPTIONS = [
  { value: 'recent', label: '최신순' },
  { value: 'oldest', label: '오래된 순' },
]

export const rankingStores: StoreSummary[] = Array.from({ length: 8 }, (_, i) => ({
  id: `rank-${i + 1}`,
  region: i === 0 ? '서울 강남구' : 'OO OO구',
  name: i === 0 ? 'OOO 교보타워점' : 'OOO OO점',
  manager: '홍길동 점장',
}))

export const focusStores: StoreSummary[] = Array.from({ length: 6 }, (_, i) => ({
  id: `focus-${i + 1}`,
  region: i === 0 ? '용인 처인구' : 'OO OO구',
  name: i === 0 ? 'OOO 용인역북점' : 'OOO OO점',
  manager: '홍길동 점장',
}))

export const locationResults: LocationResult[] = Array.from({ length: 6 }, (_, i) => ({
  id: `loc-${i + 1}`,
  address: '서울시 OO구 OO동',
  detail: '자세한 주소',
  description: '점포 특성 설명',
}))

export const operationReports: OperationReport[] = [
  { id: 'rep-2026-08', period: '2026년 08월', riskPercent: 'OO%', published: false },
  { id: 'rep-2026-07', period: '2026년 07월', riskPercent: 'OO%', published: true },
  { id: 'rep-2026-06', period: '2026년 06월', riskPercent: 'OO%', published: true },
]

export const notifications: Notification[] = [
  {
    id: 'risk-siren-demo-br-10',
    message: '위험 사이렌: 데모 패스트푸드점 DMC(디지털미디어시티)점의 위험 이벤트가 발동되었습니다.',
    time: '2026. 03. 31. 18:00',
  },
  { id: 'n1', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
  {
    id: 'n2',
    message: '서울 강남구 OO점의 전월 위험도 분석 리포트가 개시되었습니다.',
    time: '알림 시간',
  },
  { id: 'n3', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
  { id: 'n4', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
]

export const financialProducts: FinancialProduct[] = [
  {
    id: 'fp-emergency-stability',
    name: '긴급 경영안정자금',
    description: '위험 단계 점포의 임차료와 운영비 부담을 완화하는 긴급 자금',
  },
  {
    id: 'fp-recovery-guarantee',
    name: '소상공인 재기 지원 보증',
    description: '상환 유예와 보증을 함께 검토할 수 있는 재기 지원 상품',
  },
  {
    id: 'fp-rent-relief',
    name: '임차료 부담 완화 대출',
    description: '고정비 중 임차료 비중이 높은 사업장을 위한 운영자금',
  },
  {
    id: 'fp-operating-capital',
    name: '소상공인 운전자금',
    description: '재료비와 인건비 등 매월 필요한 운영비를 위한 자금',
  },
  {
    id: 'fp-interest-relief',
    name: '대출 이자 부담 경감 프로그램',
    description: '기존 대출의 이자 부담을 낮추는 전환·지원 프로그램',
  },
  {
    id: 'fp-digital-transition',
    name: '스마트상점 전환 지원금',
    description: '키오스크와 매장 운영 솔루션 도입을 돕는 지원 상품',
  },
]

export const riskThresholds: { level: RiskLevel; label: string }[] = [
  { level: 'safe', label: '40점 미만: 안전' },
  { level: 'warn', label: '40~69점: 주의' },
  { level: 'danger', label: '70점 이상: 위험' },
]

/**
 * 백엔드 risk-siren 결과 demo-br-10을 화면에서 재현하기 위한 이벤트 fixture.
 * 실제 알림 발송은 아직 disabled adapter이므로, UI는 발동·수신 대상·대기 상태를
 * 명시적으로 구분해 보여준다.
 */
export const syntheticRiskSirenEvent: RiskSirenEvent = {
  eventId: 'evt-cca22229364dad98f598d118',
  idempotencyKey: 'cca22229364dad98f598d118',
  branchId: 'demo-br-10',
  franchiseId: 'demo-fr-04',
  brandName: '데모 패스트푸드점 DMC(디지털미디어시티)점',
  area: '디지털미디어시티 상권',
  industry: '패스트푸드점',
  evaluatedAt: '2026. 03. 31.',
  score: 89.7199,
  grade: '위험',
  threshold: 70,
  policyVersion: 'confirmed-branch-v1',
  dispatchStatus: '대상자 알림 대기',
  recipients: ['점주', '본사'],
  evidenceIds: [
    'ev-closure-rolling-2q',
    'ev-closure-quarter',
    'ev-market-sales-qoq',
    'ev-competition-new-3m',
    'ev-branch-sales-3m',
    'ev-profit-margin-3m',
    'ev-profit-negative-streak',
    'ev-review-neg-ratio',
  ],
  signals: [
    {
      id: 'SR-05',
      label: '영업이익률',
      value: '-18.30%',
      detail: '최근 3개월 · 영업이익 연속 적자 7개월',
      score: 100,
      source: 'synthetic_self_reported',
      synthetic: true,
      level: 'danger',
    },
    {
      id: 'SR-02.branch',
      label: '가맹점 매출',
      value: '-21.59%',
      detail: '최근 3개월 vs 이전 3개월',
      score: 70.6283,
      source: 'synthetic_pos',
      synthetic: true,
      level: 'danger',
    },
    {
      id: 'SR-01',
      label: '상권 폐업률',
      value: '16.67%',
      detail: '최근 2개 분기 rolling',
      score: 100,
      source: 'seoul_open_data:음식점_상권분기_패널',
      synthetic: false,
      level: 'danger',
    },
    {
      id: 'SR-04',
      label: '부정 리뷰 비율',
      value: '25%',
      detail: '최근 90일 · 보조 신호',
      score: 65,
      source: 'synthetic_reviews',
      synthetic: true,
      level: 'warn',
    },
    {
      id: 'SR-03',
      label: '신규 경쟁업체',
      value: '0.35건',
      detail: '반경 250m 가중 관측',
      score: 4.375,
      source: 'seoul_open_data:음식점_인허가_서울',
      synthetic: false,
      level: 'safe',
    },
  ],
  timeline: [
    {
      time: '2026. 03. 31. 17:58',
      label: '운영보고서 분석 완료',
      detail: '매출·손익·리뷰 신호를 포함한 분석 결과를 생성했습니다.',
      state: 'done',
    },
    {
      time: '2026. 03. 31. 18:00',
      label: '위험 이벤트 발동',
      detail: '위험도 89.7199점이 발동 기준 70점을 초과했습니다.',
      state: 'current',
    },
    {
      time: '다음 단계',
      label: '점주·본사 알림 전달',
      detail: '알림 어댑터 연결 후 인앱·이메일 채널로 전달됩니다.',
      state: 'current',
    },
  ],
  disclosure:
    '가맹점 매출·손익·리뷰는 대회 데모용 합성 데이터입니다. 상권 폐업률·시장 매출·경쟁업체 등장은 서울시 공개데이터 실측입니다.',
}

export const currentStore: StoreSummary = {
  id: 'me',
  region: '서울 강남구',
  name: 'OOO 교보타워점',
  manager: '홍길동 점장',
}

/** Look up a store from any list; falls back to a generic placeholder. */
export function getStore(id: string | undefined): StoreSummary {
  const all = [currentStore, ...rankingStores, ...focusStores]
  return (
    all.find((s) => s.id === id) ?? {
      id: id ?? 'unknown',
      region: '서울 강남구',
      name: 'OOO 교보타워점',
      manager: '홍길동 점장',
    }
  )
}

/** Report content shown in the 보고서 내용 viewer. */
export function getReport(id: string | undefined): OperationReport & { content: string } {
  const base =
    operationReports.find((r) => r.id === id) ?? {
      id: id ?? 'unknown',
      period: '2026년 08월',
      riskPercent: 'OO%',
      published: false,
    }
  return { ...base, content: '보고서 내용' }
}
