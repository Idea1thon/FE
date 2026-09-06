import { useId } from 'react'
import { financialReportSections } from './financialReportSchema'

interface FinancialReportFormProps {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

/** Stable map key for a field's value (human-readable — used only as an object key). */
function fieldKey(sectionIndex: number, groupTitle: string, field: string) {
  return `${sectionIndex}.${groupTitle}.${field}`
}

/** Explicit map — Tailwind can't see dynamically built class names. */
const GRID_COLS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 xl:grid-cols-3',
}

/**
 * 재무제표 입력 폼 — 매출 / 원가 / 인건비 / 변동비 / 운영비 / 금융.
 *
 * 항목이 많아 한 화면에 다 들어가지 않으므로, 그룹마다 카드로 끊고 제목을 위에
 * 둔다. 값 칸은 우측 정렬 + tabular numerals 로 두어 숫자를 세로로 비교할 수 있게
 * 한다. 필드 정의(financialReportSchema)와 입력 상태 관리는 그대로다.
 */
function FinancialReportForm({ values, onChange }: FinancialReportFormProps) {
  const idPrefix = useId()

  const renderField = (
    sectionIndex: number,
    groupIndex: number,
    groupTitle: string,
    fieldIndex: number,
    field: string,
  ) => {
    const key = fieldKey(sectionIndex, groupTitle, field)
    // Index-based id — the human labels contain spaces, which are invalid in an HTML id.
    const id = `${idPrefix}-${sectionIndex}-${groupIndex}-${fieldIndex}`
    return (
      <div key={field} className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="min-w-0 flex-auto text-bodysm text-body">
          {field}
        </label>
        <input
          id={id}
          className="num h-10 w-[132px] flex-none rounded-ctl-sm border border-line bg-canvas px-3 text-right text-bodysm text-fg transition-colors duration-150 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          inputMode="numeric"
          placeholder="0"
          value={values[key] ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {financialReportSections.map((section, sectionIndex) => {
        // 한 줄 배치 섹션(금융 및 기타 / 매출 차감 항목)도 같은 카드 골격을 쓴다.
        if (section.layout === 'inline') {
          const group = section.groups[0]
          return (
            <section
              key={sectionIndex}
              className="rounded-panel border border-line bg-canvas p-5 lg:p-6"
              aria-label={group.title}
            >
              <h2 className="mb-4 text-h4 text-fg">{group.title}</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.fields.map((field, fieldIndex) =>
                  renderField(sectionIndex, 0, group.title, fieldIndex, field),
                )}
              </div>
            </section>
          )
        }

        return (
          <div key={sectionIndex} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {section.groups.map((group, groupIndex) => (
              <section
                key={group.title}
                aria-label={group.title}
                className="rounded-panel border border-line bg-canvas p-5 lg:p-6"
              >
                <h2 className="mb-4 text-h4 text-fg">{group.title}</h2>
                <div
                  className={`grid grid-cols-1 gap-x-8 gap-y-3 ${GRID_COLS[group.columns ?? 1]}`}
                >
                  {group.fields.map((field, fieldIndex) =>
                    renderField(sectionIndex, groupIndex, group.title, fieldIndex, field),
                  )}
                </div>
              </section>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default FinancialReportForm
