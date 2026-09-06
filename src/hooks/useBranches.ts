import { useCallback, useEffect, useState } from 'react'
import * as api from '../api'
import type { StoreSummary } from '../data/mock'

/** 지역 코드를 이름으로 바꾸기 위한 표. `branch` 는 코드만 갖고 있다. */
async function loadRegionNames(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const sido = await api.fetchRegions()
  const children = await Promise.all(
    sido.items.map(async (s) => {
      map.set(s.code, s.name)
      return { parent: s, items: (await api.fetchRegions(s.code)).items }
    }),
  )
  for (const { parent, items } of children) {
    for (const item of items) {
      // "서울특별시 강남구" 는 길다. 화면 폭에 맞춰 시도는 앞 두 글자만 쓴다.
      map.set(item.code, `${parent.name.slice(0, 2)} ${item.name}`)
    }
  }
  return map
}

function formatSales(value: number | null): string {
  if (value === null) return '보고서 없음'
  const eok = value / 100_000_000
  if (eok >= 1) return `${eok.toFixed(1)}억`
  return `${Math.round(value / 10_000).toLocaleString()}만`
}

const RISK_LABEL: Record<string, string> = {
  DANGER: '위험',
  CAUTION: '주의',
  NORMAL: '정상',
}

export interface BranchesState {
  stores: StoreSummary[]
  /** 최신 보고서가 있는 점포들의 평균 위험도. 없으면 null. */
  averageRisk: number | null
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * 본사 대시보드용 점포 목록.
 *
 * 목록 응답에 점장 이름이 없다. 점포마다 상세를 부르면 N+1 이 되므로 그 자리에는
 * 목록에 이미 있는 값(매출 또는 위험도)을 보여준다 — 랭킹·집중관리 화면에서는
 * 그쪽이 더 쓸모 있는 정보이기도 하다.
 */
export function useBranches(params: api.BranchListParams, showRisk = false): BranchesState {
  const [stores, setStores] = useState<StoreSummary[]>([])
  const [averageRisk, setAverageRisk] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const [regions, list] = await Promise.all([
          loadRegionNames(),
          api.fetchBranches(JSON.parse(key) as api.BranchListParams),
        ])
        if (cancelled) return

        setStores(
          list.items.map((b) => ({
            id: String(b.branch_id),
            region: regions.get(b.region_code) ?? b.region_code,
            name: b.name,
            manager: '',
            trailing: showRisk
              ? b.latest_report?.risk_level
                ? `${RISK_LABEL[b.latest_report.risk_level]} ${b.latest_report.risk_score ?? ''}`
                : '분석 전'
              : formatSales(b.latest_report?.net_sales ?? null),
          })),
        )

        const scores = list.items
          .map((b) => b.latest_report?.risk_score)
          .filter((s): s is number => typeof s === 'number')
        setAverageRisk(
          scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
        )
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof api.ApiError ? cause.message : '목록을 불러오지 못했습니다')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [key, showRisk, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  return { stores, averageRisk, loading, error, reload }
}
