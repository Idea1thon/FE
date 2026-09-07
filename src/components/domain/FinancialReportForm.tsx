import type { InputFieldItem } from '../../api'

interface FinancialReportFormProps {
  /** 백엔드가 내려준 입력 항목. 코드·이름·그룹·필수 여부가 서버 정본이다. */
  fields: InputFieldItem[]
  values: Record<string, string>
  onChange: (fieldCode: string, value: string) => void
  disabled?: boolean
}

interface ReportFormSection {
  groups: string[]
  layout?: 'stacked' | 'inline'
}

/**
 * 화면 배치만 정해 둔 표. 항목 자체는 서버가 준 `group_name` 으로 묶이고, 여기에
 * 없는 그룹은 아래에서 자동으로 뒤에 붙는다 — 서버가 항목을 추가해도 화면에서
 * 사라지지 않는다.
 */
const SECTION_LAYOUT: ReportFormSection[] = [
  { groups: ['홀 매출', '배달 매출', '포장 매출'] },
  { groups: ['매출 차감 항목'], layout: 'inline' },
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

/** Explicit map — Tailwind can't see dynamically built class names. */
const GRID_COLS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 xl:grid-cols-3',
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

/**
 * 운영보고서 입력 폼. 백엔드 `field_code` 와 금액을 그대로 묶어 제출한다.
 *
 * 그룹마다 카드로 끊고 제목을 위에 둔다. 값 칸은 우측 정렬 + tabular numerals 라
 * 숫자를 세로로 비교할 수 있다. 필수 항목은 `*` 와 `aria-required` 로 함께 표시한다.
 */
function FinancialReportForm({
  fields,
  values,
  onChange,
  disabled = false,
}: FinancialReportFormProps) {
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
        <label htmlFor={id} className="min-w-0 flex-auto text-bodysm text-body">
          {field.name}
          {field.is_required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <input
          id={id}
          className="num h-10 w-[132px] flex-none rounded-ctl-sm border border-line bg-canvas px-3 text-right text-bodysm text-fg transition-colors duration-150 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted"
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
    <div className="flex flex-col gap-4">
      {sections.map((section) => {
        // 서버가 그 그룹을 내려주지 않았으면 빈 카드를 만들지 않는다.
        const sectionFields = section.groups.flatMap((group) => grouped.get(group) ?? [])
        if (sectionFields.length === 0) return null

        if (section.layout === 'inline') {
          return (
            <section
              key={section.groups.join('-')}
              aria-label={section.groups[0]}
              className="rounded-panel border border-line bg-canvas p-5 lg:p-6"
            >
              <h2 className="mb-4 text-h4 text-fg">{section.groups[0]}</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                {sectionFields.map(renderField)}
              </div>
            </section>
          )
        }

        return (
          <div key={section.groups.join('-')} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {section.groups.map((group) => {
              const groupFieldsForSection = grouped.get(group) ?? []
              if (groupFieldsForSection.length === 0) return null
              const columns = GROUP_COLUMNS[group] ?? 1
              return (
                <section
                  key={group}
                  aria-label={group}
                  className="rounded-panel border border-line bg-canvas p-5 lg:p-6"
                >
                  <h2 className="mb-4 text-h4 text-fg">{group}</h2>
                  <div className={`grid grid-cols-1 gap-x-8 gap-y-3 ${GRID_COLS[columns]}`}>
                    {groupFieldsForSection.map(renderField)}
                  </div>
                </section>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default FinancialReportForm
