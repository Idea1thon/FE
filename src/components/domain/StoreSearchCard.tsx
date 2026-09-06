import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import Icon from '../ui/Icon'
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
 * 지역은 서버의 `region` 표에서 받아온다. 하드코딩하면 추천 서비스가 지원하는
 * 범위와 어긋나 "선택은 되는데 결과가 없다"가 된다.
 */
function StoreSearchCard({ onSearch, pending = false }: StoreSearchCardProps) {
  const region = useRegionSelect()
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: '', label: '업종 선택' },
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
          { value: '', label: '업종 선택' },
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

  const selectClass = 'flex-1 basis-[calc(50%-8px)] lg:basis-0'

  return (
    <Card title="신규 점포 입지 분석">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
          <Select
            ariaLabel="시·도 선택 (필수)"
            options={region.sidoOptions}
            value={region.sido}
            onChange={(e) => region.setSido(e.target.value)}
            className={selectClass}
          />
          <Select
            ariaLabel="시·군·구 선택 (필수)"
            options={region.sigunguOptions}
            value={region.sigungu}
            onChange={(e) => region.setSigungu(e.target.value)}
            disabled={!region.sido}
            className={selectClass}
          />
          <Select
            ariaLabel="행정동 선택 (선택)"
            options={region.dongOptions}
            value={region.dong}
            onChange={(e) => region.setDong(e.target.value)}
            disabled={!region.sigungu}
            className={selectClass}
          />
          <Select
            ariaLabel="업종 선택"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          />
          <button
            type="submit"
            disabled={pending}
            className="flex-none inline-flex items-center justify-center w-12 h-12 bg-transparent border-0 cursor-pointer text-w-ink rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-w-ink disabled:cursor-progress disabled:opacity-50"
            aria-label="검색"
          >
            <Icon name="search" size={28} />
          </button>
        </div>

        <TextField
          label="신규 점포 추가 조건"
          hideLabel
          layout="stacked"
          value={conditionText}
          onChange={(e) => setConditionText(e.target.value)}
          placeholder="신규 점포의 특별한 조건이 있다면 입력해주세요."
          maxLength={2000}
        />

        {(region.error || (touched && !region.selectedCode)) && (
          <p role="alert" className="m-0 text-[15px] text-w-ink">
            {region.error ?? '시·군·구까지 선택해 주세요.'}
          </p>
        )}
      </form>
    </Card>
  )
}

export default StoreSearchCard
