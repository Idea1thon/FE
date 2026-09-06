/** Field layout for the 재무제표 보고서 입력 폼 (아이디어1톤 wireframe). */

export interface ReportFieldGroup {
  title: string
  fields: string[]
  /** Desktop column count for this group's field grid (default 1 — fields stack). */
  columns?: number
}

export interface ReportFormSection {
  /** Groups sit side by side within a section; sections are divider-separated. */
  groups: ReportFieldGroup[]
  /**
   * `stacked` (default): each group is a title on the left with its field grid on the right.
   * `inline`: a single centered title followed by every field on one row —
   * the 금융 및 기타 / 매출 차감 항목 adjustment strips.
   */
  layout?: 'stacked' | 'inline'
  /**
   * Render flush against the previous section — no divider, no top padding.
   * 매출 차감 항목 belongs to the 매출 block, so it must not be split off by a divider.
   */
  attached?: boolean
}

export const financialReportSections: ReportFormSection[] = [
  {
    groups: [
      { title: '홀 매출', fields: ['신용카드', '현금', '간편결제'] },
      { title: '배달 매출', fields: ['배달의 민족', '쿠팡이츠', '기타'] },
      { title: '포장 매출', fields: ['신용카드', '현금', '간편결제'] },
    ],
  },
  {
    layout: 'inline',
    attached: true,
    groups: [
      { title: '매출 차감 항목', fields: ['고객 환불', '자체 할인 쿠폰 적용액'] },
    ],
  },
  {
    groups: [
      { title: '식자재', fields: ['당월 식자재', '부자재 매입'] },
      { title: '주류/음료', fields: ['주류', '음료'] },
      { title: '재고액', fields: ['기초 재고액', '기말 재고액'] },
    ],
  },
  {
    groups: [
      {
        title: '인건비',
        columns: 3,
        fields: ['정규직 급여', '파트타임 급여', '4대 보험료', '식대/복리후생비', '단기 인력 급여'],
      },
    ],
  },
  {
    groups: [
      {
        title: '변동비',
        columns: 3,
        fields: ['플랫폼 수수료', '배달 대행료', '소모품비', '수도광열비', '마케팅/광고비'],
      },
    ],
  },
  {
    groups: [
      {
        title: '운영비',
        columns: 3,
        fields: [
          '임차료/관리비',
          '기기 렌탈료',
          '통신/IT 비용',
          '세무/기장 대행료',
          '보험료',
          '카드 수수료',
        ],
      },
    ],
  },
  {
    layout: 'inline',
    groups: [{ title: '금융 및 기타', fields: ['대출 이자', '기타 잡비'] }],
  },
]
