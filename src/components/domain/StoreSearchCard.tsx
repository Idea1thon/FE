import { useState } from 'react'
import type { FormEvent } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import Icon from '../ui/Icon'
import { DO_OPTIONS, SI_OPTIONS, DONG_OPTIONS } from '../../data/mock'

interface StoreSearchCardProps {
  /** Fired on search-button click — 도/시 required, 동 optional. */
  onSearch: (filters: { do: string; si: string; dong: string; keyword: string }) => void
}

/**
 * 신규 점포 입지 분석 검색 카드.
 * 도 / 시 드롭다운은 필수, 동은 선택, 그리고 자유 텍스트 조건 입력.
 */
function StoreSearchCard({ onSearch }: StoreSearchCardProps) {
  const [doValue, setDoValue] = useState('')
  const [siValue, setSiValue] = useState('')
  const [dongValue, setDongValue] = useState('')
  const [keyword, setKeyword] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSearch({ do: doValue, si: siValue, dong: dongValue, keyword })
  }

  const selectClass = 'flex-1 basis-[calc(50%-8px)] lg:basis-0'

  return (
    <Card title="신규 점포 입지 분석">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
          <Select
            ariaLabel="도 선택 (필수)"
            options={DO_OPTIONS}
            value={doValue}
            onChange={(e) => setDoValue(e.target.value)}
            className={selectClass}
          />
          <Select
            ariaLabel="시 선택 (필수)"
            options={SI_OPTIONS}
            value={siValue}
            onChange={(e) => setSiValue(e.target.value)}
            className={selectClass}
          />
          <Select
            ariaLabel="동 선택 (선택)"
            options={DONG_OPTIONS}
            value={dongValue}
            onChange={(e) => setDongValue(e.target.value)}
            className={selectClass}
          />
          <button
            type="submit"
            className="flex-none inline-flex items-center justify-center w-12 h-12 bg-transparent border-0 cursor-pointer text-w-ink rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-w-ink"
            aria-label="검색"
          >
            <Icon name="search" size={28} />
          </button>
        </div>
        <input
          type="text"
          className="w-full h-[50px] px-4 [font:inherit] [letter-spacing:inherit] text-[15px] text-w-ink bg-w-field border border-w-line rounded-[7px] placeholder:text-w-placeholder focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-w-ink"
          placeholder="신규 점포의 특별한 조건이 있다면 입력해주세요."
          aria-label="신규 점포 추가 조건"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>
    </Card>
  )
}

export default StoreSearchCard
