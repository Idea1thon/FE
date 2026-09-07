/**
 * 추천 API의 근거 문장을 사용자에게 보여줄 수 있는 표현으로 정리한다.
 *
 * FC 코드와 entry_health_v1 값은 추천 파이프라인 내부 구현 정보라서
 * 화면에 그대로 노출하지 않는다. 근거 자체의 의미는 유지하되, 내부
 * 판정 용어는 사용자가 이해하기 쉬운 표현으로 바꾼다.
 */
export function toFriendlyLocationEvidence(value: string): string | null {
  const cleaned = value
    .replace(/\s*\((?=[^)]*(?:\bFC-\d+[a-z]?(?:-[a-z][a-z0-9_-]*)?\b|\bentry_health_v1\s*=))[^)]*\)/gi, '')
    .replace(/\bFC-\d+[a-z]?(?:-[a-z][a-z0-9_-]*|_[^\s()[\],.]+)?(?:\s+[a-z][a-z0-9_-]*)?\b/gi, '')
    .replace(/\bentry_health_v1\s*=\s*[-+]?\d+(?:\.\d+)?\b/gi, '')
    .replace(/\s*\[정보\]|\s*\[차단\]/g, '')
    .replace(/약한 배경 신호/g, '주변 참고 정보')
    .replace(/반대근거\s*\d+항목/g, '주의할 점')
    .replace(/검증상 품질과 무관/g, '참고용 정보')
    .replace(/검증상 폐업\/생존과 무관/g, '참고용 지역 배경 정보')
    .replace(/판정·정렬(?:에)? 미반영|판정·정렬 근거 아님/g, '추천 순위에는 직접 반영하지 않은 참고 정보')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+—\s*$/g, '')
    .trim()

  return cleaned || null
}
