import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import Button from '../ui/Button'
import TextField from '../ui/TextField'
import { useRegionSelect } from '../../hooks/useRegionSelect'
import * as api from '../../api'

export interface LocationSearchInput {
  regionCode: string
  businessCategoryCode: string
  conditionText: string
}

interface StoreSearchCardProps {
  /** 시·군·구까지 고르면 발동. 행정동은 선택이다. */
  onSearch: (input: LocationSearchInput) => void
  /** 요청 진행 중이면 버튼을 잠근다. */
  pending?: boolean
}

/**
 * 신규 점포 입지 분석 검색 카드.
 *
 * 지역·업종은 서버에서 받아온다 (변경 없음). 하드코딩하면 추천 서비스가 지원하는
 * 범위와 어긋나 "선택은 되는데 결과가 없다"가 된다.
 *
 * Layout follows DESIGN.md §6: every control carries a visible label so the
 * question being asked is concrete, and the required fields are marked rather
 * than only failing on submit.
 */
function StoreSearchCard({ onSearch, pending = false }: StoreSearchCardProps) {
  const region = useRegionSelect()
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: '', label: '업종 전체' },
  ])
  const [conditionText, setConditionText] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .fetchBusinessCategories()
      .then((res) => {
        if (cancelled) return
        setCategories([
          { value: '', label: '업종 전체' },
          ...res.items.map((c) => ({ value: c.code, label: c.name })),
        ])
      })
      // 업종은 선택 항목이다. 실패해도 지역만으로 추천을 요청할 수 있다.
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!region.selectedCode) return
    onSearch({
      regionCode: region.selectedCode,
      businessCategoryCode: category,
      conditionText: conditionText.trim(),
    })
  }

  const missingRegion = touched && !region.selectedCode

  return (
    <Card
      title="신규 점포 입지 분석"
      description="지역과 업종을 고르면 추천 입지와 근거를 함께 보여줍니다."
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="시 · 도"
            ariaLabel="시·도 선택 (필수)"
            options={region.sidoOptions}
            value={region.sido}
            onChange={(e) => region.setSido(e.target.value)}
          />
          <Select
            label="시 · 군 · 구"
            ariaLabel="시·군·구 선택 (필수)"
            options={region.sigunguOptions}
            value={region.sigungu}
            onChange={(e) => region.setSigungu(e.target.value)}
            disabled={!region.sido}
            error={missingRegion ? '시·군·구까지 선택해 주세요' : undefined}
          />
          <Select
            label="행정동 (선택)"
            ariaLabel="행정동 선택 (선택)"
            options={region.dongOptions}
            value={region.dong}
            onChange={(e) => region.setDong(e.target.value)}
            disabled={!region.sigungu}
          />
          <Select
            label="업종 (선택)"
            ariaLabel="업종 선택"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <TextField
          label="추가 조건 (선택)"
          value={conditionText}
          onChange={(e) => setConditionText(e.target.value)}
          placeholder="예: 직장인 점심 수요가 많고 경쟁이 적은 곳"
          maxLength={2000}
          help="찾는 조건을 문장으로 적으면 그 조건에 맞춰 근거를 정리합니다."
        />

        {region.error && (
          <p role="alert" className="text-bodysm text-danger">
            {region.error}
          </p>
        )}

        <Button type="submit" size="lg" block loading={pending}>
          입지 분석 시작
        </Button>
      </form>
    </Card>
  )
}

export default StoreSearchCard
