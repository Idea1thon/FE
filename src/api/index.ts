/** 화면에서 쓰는 API 함수 모음. */
import { request, requestWithStatus } from './client'
import type {
  BranchDetail,
  BranchListItem,
  BusinessCategoryItem,
  FinancialProductItem,
  InputFieldItem,
  LocationRecommendationPending,
  LocationRecommendationResult,
  LoginResponse,
  NotificationItem,
  RegionItem,
  ReportDetail,
  ReportListItem,
  RiskLevel,
} from './types'

export * from './types'
export { ApiError, setToken, setUnauthorizedHandler } from './client'

// ---------------------------------------------------------------- Auth
export function login(email: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    anonymous: true,
  })
}

export function logout(refreshToken: string) {
  return request<void>('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })
}

// ---------------------------------------------------------------- 기준정보
export function fetchRegions(parentCode?: string) {
  const query = parentCode ? `?parent_code=${encodeURIComponent(parentCode)}` : ''
  return request<{ items: RegionItem[] }>(`/regions${query}`)
}

export function fetchBusinessCategories() {
  return request<{ items: BusinessCategoryItem[] }>('/business-categories')
}

// ---------------------------------------------------------------- 가맹점
export interface BranchListParams {
  risk_level?: RiskLevel
  region_code?: string
  q?: string
  sort?: 'net_sales_desc' | 'net_sales_asc' | 'risk_desc'
  limit?: number
  offset?: number
}

export function fetchBranches(params: BranchListParams = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const suffix = query.toString() ? `?${query}` : ''
  return request<{ items: BranchListItem[] }>(`/branches${suffix}`)
}

export function fetchBranch(branchId: number) {
  return request<BranchDetail>(`/branches/${branchId}`)
}

export function fetchBranchReports(branchId: number, sort: 'month_desc' | 'month_asc' = 'month_desc') {
  return request<{ items: ReportListItem[] }>(`/branches/${branchId}/reports?sort=${sort}`)
}

export function fetchMyReports(sort: 'month_desc' | 'month_asc' = 'month_desc', limit = 100) {
  return request<{ items: ReportListItem[] }>(
    `/reports?sort=${sort}&limit=${limit}`,
  )
}

// ---------------------------------------------------------------- 보고서
export function fetchInputFields() {
  return request<{ items: InputFieldItem[] }>('/reports/input-fields')
}

export function submitReport(payload: {
  report_month: string
  input_source?: 'MANUAL' | 'POS'
  items: { field_code: string; amount: number }[]
}) {
  return request<{ report_id: number; status: string; analysis_request_id: string }>('/reports', {
    method: 'POST',
    body: payload,
  })
}

export function fetchReport(reportId: number) {
  return request<ReportDetail>(`/reports/${reportId}`)
}

export function fetchReportStatus(reportId: number) {
  return request<{ report_id: number; status: string; analysis_error: string | null }>(
    `/reports/${reportId}/status`,
  )
}

// ---------------------------------------------------------------- 알림·금융상품
export function fetchNotifications(params: { is_read?: boolean; limit?: number } = {}) {
  const query = new URLSearchParams()
  if (params.is_read !== undefined) query.set('is_read', String(params.is_read))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const suffix = query.toString() ? `?${query}` : ''
  return request<{ unread_count: number; next_cursor: string | null; items: NotificationItem[] }>(
    `/notifications${suffix}`,
  )
}

export function markNotificationRead(notificationId: number) {
  return request<{ notification_id: number; is_read: boolean; read_at: string | null }>(
    `/notifications/${notificationId}/read`,
    { method: 'PATCH' },
  )
}

export function fetchFinancialProducts() {
  return request<{ risk_level: RiskLevel | null; items: FinancialProductItem[] }>(
    '/financial-products',
  )
}

// ---------------------------------------------------------------- 입지 추천
export type LocationRecommendationReply =
  | { done: true; result: LocationRecommendationResult }
  | { done: false; pending: LocationRecommendationPending }

/**
 * 추천 요청. 서버가 200(결과) 또는 202(실행 중)를 준다.
 *
 * 202 를 받으면 `pending.retry_after` 초 뒤에 `pollLocationRecommendation` 을
 * 같은 `run_ticket` 으로 부른다. 티켓은 해석하지 말고 그대로 실어 보낸다.
 */
export async function requestLocationRecommendation(payload: {
  region_code: string
  business_category_code?: string
  special_condition_text?: string
  limit?: number
}): Promise<LocationRecommendationReply> {
  const { status, data } = await requestWithStatus<
    LocationRecommendationResult | LocationRecommendationPending
  >('/location-recommendations', { method: 'POST', body: payload })

  return status === 202
    ? { done: false, pending: data as LocationRecommendationPending }
    : { done: true, result: data as LocationRecommendationResult }
}

export async function pollLocationRecommendation(
  runTicket: string,
): Promise<LocationRecommendationReply> {
  const { status, data } = await requestWithStatus<
    LocationRecommendationResult | LocationRecommendationPending
  >(`/location-recommendations/${encodeURIComponent(runTicket)}`)

  return status === 202
    ? { done: false, pending: data as LocationRecommendationPending }
    : { done: true, result: data as LocationRecommendationResult }
}
