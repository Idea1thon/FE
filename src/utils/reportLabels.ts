import type { InputFieldItem } from '../api'

const FIELD_LABELS: Record<string, string> = {
  HALL_CARD: '신용카드(홀)',
  HALL_CASH: '현금(홀)',
  HALL_EASYPAY: '간편결제(홀)',
  DLV_BAEMIN: '배달의민족',
  DLV_COUPANG: '쿠팡이츠',
  DLV_ETC: '기타(배달)',
  TOGO_CARD: '신용카드(포장)',
  TOGO_CASH: '현금(포장)',
  TOGO_EASYPAY: '간편결제(포장)',
  DED_REFUND: '고객 환불',
  DED_COUPON: '자체 할인 쿠폰 적용액',
  MAT_FOOD: '당월 식자재',
  MAT_SUB: '부자재 매입',
  BEV_ALCOHOL: '주류',
  BEV_DRINK: '음료',
  INV_BEGIN: '기초 재고액',
  INV_END: '기말 재고액',
  LAB_FULLTIME: '정규직 급여',
  LAB_PARTTIME: '파트타임 급여',
  LAB_INSURANCE: '4대 보험료',
  LAB_WELFARE: '식대·복리후생비',
  LAB_SHORTTERM: '단기 인력 급여',
  VAR_PLATFORM_FEE: '플랫폼 수수료',
  VAR_DELIVERY_FEE: '배달 대행료',
  VAR_SUPPLIES: '소모품비',
  VAR_UTILITY: '수도광열비',
  VAR_MARKETING: '마케팅·광고비',
  OPS_RENT: '임차료·관리비',
  OPS_RENTAL: '기기 렌탈료',
  OPS_TELECOM: '통신·IT 비용',
  OPS_ACCOUNTING: '세무·기장 대행료',
  OPS_INSURANCE: '보험료',
  OPS_CARD_FEE: '카드 수수료',
  FIN_LOAN_INTEREST: '대출이자',
  FIN_MISC: '기타 잡비',
}

const GROUP_BY_FIELD_CODE: Record<string, string> = {
  HALL_CARD: '홀 매출',
  HALL_CASH: '홀 매출',
  HALL_EASYPAY: '홀 매출',
  DLV_BAEMIN: '배달 매출',
  DLV_COUPANG: '배달 매출',
  DLV_ETC: '배달 매출',
  TOGO_CARD: '포장 매출',
  TOGO_CASH: '포장 매출',
  TOGO_EASYPAY: '포장 매출',
  DED_REFUND: '매출 차감 항목',
  DED_COUPON: '매출 차감 항목',
  MAT_FOOD: '식자재',
  MAT_SUB: '식자재',
  BEV_ALCOHOL: '주류/음료',
  BEV_DRINK: '주류/음료',
  INV_BEGIN: '재고액',
  INV_END: '재고액',
  LAB_FULLTIME: '인건비',
  LAB_PARTTIME: '인건비',
  LAB_INSURANCE: '인건비',
  LAB_WELFARE: '인건비',
  LAB_SHORTTERM: '인건비',
  VAR_PLATFORM_FEE: '변동비',
  VAR_DELIVERY_FEE: '변동비',
  VAR_SUPPLIES: '변동비',
  VAR_UTILITY: '변동비',
  VAR_MARKETING: '변동비',
  OPS_RENT: '운영비',
  OPS_RENTAL: '운영비',
  OPS_TELECOM: '운영비',
  OPS_ACCOUNTING: '운영비',
  OPS_INSURANCE: '운영비',
  OPS_CARD_FEE: '운영비',
  FIN_LOAN_INTEREST: '금융 및 기타',
  FIN_MISC: '금융 및 기타',
}

const GROUP_LABELS: Record<string, string> = {
  sales: '매출',
  revenue: '매출',
  deductions: '매출 차감 항목',
  materials: '식자재',
  beverages: '주류/음료',
  inventory: '재고액',
  labor: '인건비',
  variable_costs: '변동비',
  operating_costs: '운영비',
  finance: '금융 및 기타',
}

function localizedGroupName(field: InputFieldItem) {
  const code = field.code.toUpperCase()
  return GROUP_BY_FIELD_CODE[code] ?? GROUP_LABELS[field.group_name.toLowerCase()] ?? field.group_name
}

/** API가 영문 라벨을 내려줘도 운영보고서 입력 화면은 한글로 표시한다. */
export function localizeInputField(field: InputFieldItem): InputFieldItem {
  const code = field.code.toUpperCase()
  return {
    ...field,
    name: FIELD_LABELS[code] ?? field.name,
    group_name: localizedGroupName(field),
  }
}

export function localizeInputFields(fields: InputFieldItem[]) {
  return fields.map(localizeInputField)
}
