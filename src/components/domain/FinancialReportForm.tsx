import type { InputFieldItem } from '../../api'

interface FinancialReportFormProps {
  fields: InputFieldItem[]
  values: Record<string, string>
  onChange: (fieldCode: string, value: string) => void
  disabled?: boolean
}

interface ReportFormSection {
  groups: string[]
  layout?: 'stacked' | 'inline'
  attached?: boolean
}

const SECTION_LAYOUT: ReportFormSection[] = [
  { groups: ['홀 매출', '배달 매출', '포장 매출'] },
  { groups: ['매출 차감 항목'], layout: 'inline', attached: true },
  { groups: ['식자재', '주류/음료', '재고액'] },
  { groups: ['인건비'] },
  { groups: ['변동비'] },
  { groups: ['운영비'] },
  { groups: ['금융 및 기타'], layout: 'inline' },
]

const GROUP_COLUMNS: Record<string, number> = {
  인건비: 3,
  변동비: 3,
  운영비: 3,
}

const GRID_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
}

function groupFields(fields: InputFieldItem[]) {
  const grouped = new Map<string, InputFieldItem[]>()
  for (const field of [...fields].sort((a, b) => a.display_order - b.display_order)) {
    const current = grouped.get(field.group_name) ?? []
    current.push(field)
    grouped.set(field.group_name, current)
  }
  return grouped
}

/** 백엔드가 내려준 field_code와 금액을 그대로 묶어 제출하는 운영보고서 입력 폼. */
function FinancialReportForm({ fields, values, onChange, disabled = false }: FinancialReportFormProps) {
  const grouped = groupFields(fields)
  const knownGroups = new Set(SECTION_LAYOUT.flatMap((section) => section.groups))
  const unknownGroups = [...grouped.keys()].filter((group) => !knownGroups.has(group))
  const sections: ReportFormSection[] = [
    ...SECTION_LAYOUT,
    ...unknownGroups.map((group) => ({ groups: [group] })),
  ]

  const renderField = (field: InputFieldItem) => {
    const id = `report-${field.code.toLowerCase()}`
    return (
      <div key={field.code} className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex-auto text-[15px] text-w-ink [word-break:keep-all]">
          {field.name}
          {field.is_required && <span className="ml-1 text-risk-danger" aria-hidden="true">*</span>}
        </label>
        <input
          id={id}
          className="flex-none w-[140px] h-[34px] px-2.5 [font:inherit] [letter-spacing:inherit] text-[15px] text-w-ink bg-w-field border border-w-line rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-w-ink disabled:cursor-not-allowed disabled:bg-w-row"
          inputMode="numeric"
          pattern="[0-9,]*"
          aria-required={field.is_required}
          placeholder="0"
          disabled={disabled}
          value={values[field.code] ?? ''}
          onChange={(event) => onChange(field.code, event.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sections.map((section, sectionIndex) => {
        const divider = sectionIndex > 0 && !section.attached ? 'border-t border-w-line' : ''
        const pad = section.attached ? 'pb-6' : 'py-6'

        if (section.layout === 'inline') {
          const fieldsInSection = section.groups.flatMap((group) => grouped.get(group) ?? [])
          return (
            <div
              key={section.groups.join('-')}
              className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-4 ${pad} ${divider}`}
            >
              <span className="text-[22px] font-medium leading-[1.3] text-w-ink [word-break:keep-all]">
                {section.groups[0]}
              </span>
              {fieldsInSection.map(renderField)}
            </div>
          )
        }

        return (
          <div key={section.groups.join('-')} className={`flex flex-wrap gap-x-12 gap-y-6 ${pad} ${divider}`}>
            {section.groups.map((group) => {
              const groupFieldsForSection = grouped.get(group) ?? []
              const columns = GROUP_COLUMNS[group] ?? 1
              return (
                <div
                  key={group}
                  role="group"
                  aria-label={group}
                  className="flex flex-wrap items-start gap-x-5 gap-y-2.5 flex-[1_1_320px] min-w-[280px]"
                >
                  <p className="flex-none w-[104px] text-[22px] font-medium leading-[1.3] text-w-ink [word-break:keep-all]">
                    {group}
                  </p>
                  <div className={`flex-auto grid grid-cols-1 gap-x-8 gap-y-3 ${GRID_COLS[columns]}`}>
                    {groupFieldsForSection.map(renderField)}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default FinancialReportForm
