import { useEffect, useState } from 'react'
import * as api from '../api'
import type { SelectOption } from '../components/ui/Select'

const PLACEHOLDER = { sido: '시·도 선택', sigungu: '시·군·구 선택', dong: '행정동 (선택)' }

export interface RegionSelectState {
  sidoOptions: SelectOption[]
  sigunguOptions: SelectOption[]
  dongOptions: SelectOption[]
  sido: string
  sigungu: string
  dong: string
  setSido: (code: string) => void
  setSigungu: (code: string) => void
  setDong: (code: string) => void
  /** 추천 요청에 실을 코드. 동을 골랐으면 동, 아니면 시군구. */
  selectedCode: string
  error: string | null
}

/**
 * 시도 → 시군구 → 행정동 3단 선택.
 *
 * 추천 서비스에 넘길 값은 코드 하나면 된다. 서버가 region 테이블에서 이름으로
 * 바꾸고 상위 계층도 채운다. 여기서는 무엇을 고를 수 있는지만 보여준다.
 */
export function useRegionSelect(): RegionSelectState {
  const [sidoOptions, setSidoOptions] = useState<SelectOption[]>([])
  const [sigunguOptions, setSigunguOptions] = useState<SelectOption[]>([])
  const [dongOptions, setDongOptions] = useState<SelectOption[]>([])
  const [sido, setSidoRaw] = useState('')
  const [sigungu, setSigunguRaw] = useState('')
  const [dong, setDong] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .fetchRegions()
      .then((res) => {
        if (cancelled) return
        setSidoOptions([
          { value: '', label: PLACEHOLDER.sido },
          ...res.items.map((r) => ({ value: r.code, label: r.name })),
        ])
      })
      .catch((cause) =>
        setError(cause instanceof api.ApiError ? cause.message : '지역을 불러오지 못했습니다'),
      )
    return () => {
      cancelled = true
    }
  }, [])

  // 상위를 바꾸면 하위 선택은 무효가 된다. 남겨두면 강남구 안에 서교동이 붙는다.
  const setSido = (code: string) => {
    setSidoRaw(code)
    setSigunguRaw('')
    setDong('')
    setSigunguOptions([])
    setDongOptions([])
    if (!code) return
    api.fetchRegions(code).then((res) =>
      setSigunguOptions([
        { value: '', label: PLACEHOLDER.sigungu },
        ...res.items.map((r) => ({ value: r.code, label: r.name })),
      ]),
    )
  }

  const setSigungu = (code: string) => {
    setSigunguRaw(code)
    setDong('')
    setDongOptions([])
    if (!code) return
    api.fetchRegions(code).then((res) =>
      setDongOptions([
        { value: '', label: PLACEHOLDER.dong },
        ...res.items.map((r) => ({ value: r.code, label: r.name })),
      ]),
    )
  }

  return {
    sidoOptions,
    sigunguOptions: sigunguOptions.length ? sigunguOptions : [{ value: '', label: PLACEHOLDER.sigungu }],
    dongOptions: dongOptions.length ? dongOptions : [{ value: '', label: PLACEHOLDER.dong }],
    sido,
    sigungu,
    dong,
    setSido,
    setSigungu,
    setDong,
    selectedCode: dong || sigungu,
    error,
  }
}
