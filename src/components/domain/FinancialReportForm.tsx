import { useId } from 'react'
import { financialReportSections } from './financialReportSchema'

interface FinancialReportFormProps {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

function fieldKey(sectionIndex: number, groupTitle: string, field: string) {
  return `${sectionIndex}.${groupTitle}.${field}`
}

/** Explicit map — Tailwind can't see dynamically built class names. */
const GRID_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
}

/** 재무제표 보고서 입력 폼 — 매출 / 원가 / 인건비 / 변동비 / 운영비 / 금융. */
function FinancialReportForm({ values, onChange }: FinancialReportFormProps) {
  const idPrefix = useId()

  const renderField = (sectionIndex: number, groupTitle: string, field: string) => {
    const key = fieldKey(sectionIndex, groupTitle, field)
    const id = `${idPrefix}-${key}`
    return (
      <div key={field} className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex-auto text-[15px] text-w-ink [word-break:keep-all]">
          {field}
        </label>
        <input
          id={id}
          className="flex-none w-[140px] h-[34px] px-2.5 [font:inherit] [letter-spacing:inherit] text-[15px] text-w-ink bg-w-field border border-w-line rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-w-ink"
          inputMode="numeric"
          value={values[key] ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {financialReportSections.map((section, sectionIndex) => {
        const divider =
          sectionIndex > 0 && !section.attached ? 'border-t border-w-line' : ''
        const pad = section.attached ? 'pb-6' : 'py-6'

        // 금융 및 기타 / 매출 차감 항목 — one centered title, every field on a single row.
        if (section.layout === 'inline') {
          const group = section.groups[0]
          return (
            <div
              key={sectionIndex}
              className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-4 ${pad} ${divider}`}
            >
              <span className="text-[22px] font-medium leading-[1.3] text-w-ink [word-break:keep-all]">
                {group.title}
              </span>
              {group.fields.map((field) => renderField(sectionIndex, group.title, field))}
            </div>
          )
        }

        // Stacked sections — group title on the left, its field grid on the right.
        return (
          <div key={sectionIndex} className={`flex flex-wrap gap-x-12 gap-y-6 ${pad} ${divider}`}>
            {section.groups.map((group) => (
              <div
                key={group.title}
                role="group"
                aria-label={group.title}
                className="flex flex-wrap items-start gap-x-5 gap-y-2.5 flex-[1_1_320px] min-w-[280px]"
              >
                <p className="flex-none w-[104px] text-[22px] font-medium leading-[1.3] text-w-ink [word-break:keep-all]">
                  {group.title}
                </p>
                <div
                  className={`flex-auto grid grid-cols-1 gap-x-8 gap-y-3 ${GRID_COLS[group.columns ?? 1]}`}
                >
                  {group.fields.map((field) => renderField(sectionIndex, group.title, field))}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default FinancialReportForm
