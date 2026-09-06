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
  { id: 'n1', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
  {
    id: 'n2',
    message: '서울 강남구 OO점의 전월 위험도 분석 리포트가 개시되었습니다.',
    time: '알림 시간',
  },
  { id: 'n3', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
  { id: 'n4', message: '전월 위험도 분석 리포트가 완성되었습니다.', time: '알림 시간' },
]

export const financialProducts: FinancialProduct[] = Array.from({ length: 3 }, (_, i) => ({
  id: `fp-${i + 1}`,
  name: '금융상품명',
  description: '금융상품의 간단한 설명',
}))

export const riskThresholds: { level: RiskLevel; label: string }[] = [
  { level: 'safe', label: 'OO% 미만: 안전' },
  { level: 'warn', label: 'OO% 미만: 보통' },
  { level: 'danger', label: 'OO% 미만: 위험' },
]

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
