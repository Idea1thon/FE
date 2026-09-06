import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import RiskText from '../../components/ui/RiskText'
import { syntheticRiskSirenEvent } from '../../data/mock'

function signalBarClass(level: 'safe' | 'warn' | 'danger') {
  if (level === 'danger') return 'bg-risk-danger'
  if (level === 'warn') return 'bg-risk-warn'
  return 'bg-risk-safe'
}

/** 기업용 위험 사이렌 이벤트 상세 — 합성 이벤트를 실제 운영 화면 흐름으로 재현한다. */
function RiskSirenPage() {
  const navigate = useNavigate()
  const event = syntheticRiskSirenEvent
  const [acknowledged, setAcknowledged] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyEventId = async () => {
    try {
      await navigator.clipboard?.writeText(event.eventId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeading
          size="lg"
          title="위험 사이렌"
          meta="이벤트 상세"
          subtitle="합성 데이터로 재현한 점포 위험 발동 흐름"
          actions={
            <Button onClick={() => navigate('/enterprise')}>대시보드로 돌아가기</Button>
          }
        />

        <section
          aria-labelledby="risk-siren-event-title"
          className="flex flex-col gap-6 rounded-[14px] border-2 border-risk-danger bg-w-panel p-5 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-7"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-risk-danger px-3 py-1 text-[14px] font-medium text-white">
                위험 이벤트 발동
              </span>
              <span className="text-[15px] text-w-placeholder">{event.evaluatedAt} 분석</span>
            </div>
            <div>
              <h2 id="risk-siren-event-title" className="text-[26px] font-medium lg:text-[36px]">
                {event.brandName}
              </h2>
              <p className="mt-2 text-[16px] text-w-placeholder lg:text-[18px]">
                {event.area} · {event.industry} · 점포 ID {event.branchId}
              </p>
            </div>
            <p className="max-w-[700px] text-[16px] leading-[1.65] text-w-ink lg:text-[18px]">
              종합 위험도 <strong>{event.threshold}점</strong> 기준을 초과했습니다. 아래 근거를
              확인한 뒤 점주와 본사의 후속 조치를 시작할 수 있습니다.
            </p>
          </div>

          <div className="flex shrink-0 items-end gap-4">
            <div className="min-w-[150px] border border-w-line bg-w-field px-5 py-4">
              <span className="block text-[14px] text-w-placeholder">현재 위험도</span>
              <strong className="mt-1 block text-[40px] leading-none text-risk-danger lg:text-[52px]">
                {event.score.toFixed(1)}
              </strong>
              <RiskText level="danger" className="mt-2 block text-[16px]">
                {event.grade}
              </RiskText>
            </div>
            <div className="hidden min-w-[140px] border border-w-line bg-w-field px-5 py-4 sm:block">
              <span className="block text-[14px] text-w-placeholder">발동 기준</span>
              <strong className="mt-1 block text-[30px] leading-none text-w-ink">
                {event.threshold}점
              </strong>
              <span className="mt-2 block text-[15px] text-w-placeholder">초과 감지</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <Card
            title="발동 근거"
            action={<span className="text-[14px] text-w-placeholder">점수 기여 신호</span>}
          >
            <div className="flex flex-col divide-y divide-w-line">
              {event.signals.map((signal) => (
                <div key={signal.id} className="py-4 first:pt-1 last:pb-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] text-w-placeholder">{signal.id}</span>
                        <h3 className="text-[18px] font-medium">{signal.label}</h3>
                        {signal.synthetic && (
                          <span className="rounded-full border border-w-line px-2 py-0.5 text-[12px] text-w-placeholder">
                            합성
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[15px] text-w-placeholder">{signal.detail}</p>
                    </div>
                    <div className="text-right">
                      <RiskText level={signal.level} className="text-[20px]">
                        {signal.value}
                      </RiskText>
                      <span className="mt-1 block text-[13px] text-w-placeholder">
                        신호점수 {signal.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-w-row">
                    <div
                      className={`h-full rounded-full ${signalBarClass(signal.level)}`}
                      style={{ width: `${Math.min(signal.score, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 truncate text-[13px] text-w-placeholder" title={signal.source}>
                    source · {signal.source}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="이벤트 처리">
            <div className="flex flex-col gap-5">
              <div className="border border-w-line bg-w-field p-4">
                <span className="block text-[14px] text-w-placeholder">현재 처리 상태</span>
                <strong className="mt-1 block text-[20px] text-w-ink">
                  {acknowledged ? '조치 확인됨' : '확인 필요'}
                </strong>
                <p className="mt-2 text-[14px] leading-[1.5] text-w-placeholder">
                  {acknowledged
                    ? '이 화면에서 확인 상태로 표시했습니다. 저장 API 연결 전까지는 데모 상태입니다.'
                    : '위험 근거를 확인하고 담당자의 후속 조치를 시작하세요.'}
                </p>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-[15px]">
                <dt className="text-w-placeholder">알림 대상</dt>
                <dd className="text-right text-w-ink">{event.recipients.join(' · ')}</dd>
                <dt className="text-w-placeholder">전송 상태</dt>
                <dd className="text-right text-w-ink">{event.dispatchStatus}</dd>
                <dt className="text-w-placeholder">정책 버전</dt>
                <dd className="text-right font-mono text-[13px] text-w-ink">{event.policyVersion}</dd>
              </dl>

              <div className="flex flex-col gap-3">
                <Button block onClick={() => setAcknowledged((value) => !value)}>
                  {acknowledged ? '확인 상태 되돌리기' : '조치 확인으로 표시'}
                </Button>
                <Button block variant="ghost" onClick={copyEventId}>
                  {copied ? '이벤트 ID를 복사했습니다' : '이벤트 ID 복사'}
                </Button>
              </div>
              <p className="text-[13px] leading-[1.5] text-w-placeholder">
                실제 이메일·외부 발송은 아직 비활성화되어 있습니다. 이 화면은 발동 이벤트와
                대상자를 검증하는 운영 UI입니다.
              </p>
            </div>
          </Card>
        </div>

        <Card
          title="이벤트 타임라인"
          action={<span className="text-[14px] text-w-placeholder">{event.eventId}</span>}
        >
          <ol className="m-0 flex list-none flex-col gap-0 p-0">
            {event.timeline.map((item, index) => (
              <li key={`${item.time}-${item.label}`} className="relative flex gap-4 pb-6 last:pb-0">
                {index < event.timeline.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-w-line" aria-hidden="true" />
                )}
                <span
                  className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-w-page ${
                    item.state === 'done' ? 'bg-w-ink' : 'bg-risk-danger'
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <h3 className="text-[17px] font-medium">{item.label}</h3>
                    <p className="mt-1 text-[15px] leading-[1.5] text-w-placeholder">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-[14px] text-w-placeholder">{item.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <section className="border border-w-line bg-w-panel px-5 py-4 lg:px-7">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div>
              <h2 className="text-[18px] font-medium">데이터 고지</h2>
              <p className="mt-1 text-[15px] leading-[1.55] text-w-placeholder">{event.disclosure}</p>
            </div>
            <span className="shrink-0 font-mono text-[13px] text-w-placeholder">
              {event.evidenceIds.length} evidence IDs
            </span>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}

export default RiskSirenPage
