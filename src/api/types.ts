/** 백엔드 응답 타입. `API_SPEC.md` 와 실제 응답을 기준으로 한다. */

export type UserType = 'HQ' | 'OWNER'
export type RiskLevel = 'NORMAL' | 'CAUTION' | 'DANGER'
export type ReportStatus = 'DRAFT' | 'ANALYZING' | 'COMPLETED' | 'FAILED'

export interface LoginUser {
  id: number
  email: string
  name: string
  user_type: UserType
  franchise_id: number
}

export interface LoginResponse {
  token: string
  refresh_token: string
  expires_in: number
  user: LoginUser
}

export interface RegionItem {
  code: string
  name: string
  level: 'SIDO' | 'SIGUNGU' | 'DONG'
}

export interface BusinessCategoryItem {
  code: string
  name: string
}

export interface LatestReportBrief {
  report_id: number
  report_month: string
  created_at: string
  status: ReportStatus
  risk_level: RiskLevel | null
  risk_score: number | null
  net_sales: number | null
}

export interface BranchListItem {
  branch_id: number
  name: string
  address: string
  region_code: string
  latest_report: LatestReportBrief | null
}

export interface BranchDetail {
  branch_id: number
  name: string
  address: string
  region: { code: string; name: string }
  business_category: { code: string; name: string }
  owner: { id: number; name: string }
}

export interface ReportListItem {
  report_id: number
  report_month: string
  created_at: string
  status: ReportStatus
  risk_level: RiskLevel | null
  risk_score: number | null
  net_sales: number | null
}

export interface ReportInputItem {
  field_code: string
  name: string
  group_name: string
  amount: number
}

export interface AnalysisDetail {
  risk_score: number | null
  risk_level: RiskLevel | null
  factors: unknown[] | Record<string, unknown>
  risk_periods: unknown[]
  recommendations: unknown[]
  calculation_status: 'calculated' | 'partial'
  rule_version: string
  calculated_at: string
}

export interface ReportDetail {
  report_id: number
  report_month: string
  created_at: string
  status: ReportStatus
  input_source: 'MANUAL' | 'POS'
  net_sales: number | null
  branch: { branch_id: number; name: string }
  inputs: ReportInputItem[]
  analysis: AnalysisDetail | null
  analysis_error: string | null
}

export interface InputFieldItem {
  code: string
  name: string
  group_name: string
  is_required: boolean
  display_order: number
}

export interface NotificationItem {
  notification_id: number
  message: string
  is_read: boolean
  created_at: string
  report_id: number
  branch_name: string
  risk_level: RiskLevel | null
}

export interface FinancialProductItem {
  product_id: number
  name: string
  description: string | null
  link_url: string
  display_order: number
}

/** 입지 추천 — 완료 응답. 내부 구조는 추천 서비스가 정본이라 느슨하게 둔다. */
export interface LocationRecommendationResult {
  run_id: string
  status: string
  request: Record<string, unknown>
  input_interpretation: Record<string, unknown>
  summary: Record<string, unknown>
  candidates: Record<string, unknown>[]
  explanations: Record<string, unknown>
}

/** 입지 추천 — 실행 중. run_ticket 은 해석하지 말고 그대로 다시 보낸다. */
export interface LocationRecommendationPending {
  run_ticket: string
  status: 'RUNNING'
  retry_after: number
}
