import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import RiskText from '../../components/ui/RiskText'
import { syntheticRiskSirenEvent } from '../../data/mock'

function signalBarClass(level: 'safe' | 'warn' | 'danger') {
  if (level === 'danger') return 'bg-risk-danger'
  if (level === 'warn') return 'bg-risk-warn'
  return 'bg-risk-safe'
}

/**
 * 기업용 위험 사이렌 이벤트 상세 — 합성 이벤트를 실제 운영 화면 흐름으로 재현한다.
 *
 * 합성 데이터라는 사실과 알림이 아직 발송되지 않는다는 사실을 화면에서 계속
 * 드러낸다. 발동 근거는 신호별 점수 막대로 보여 무엇이 점수를 밀어올렸는지 읽히게
 * 한다.
 */
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
      <PageHeading
        size="lg"
        backTo="/enterprise"
        eyebrow="위험 사이렌"
        title="이벤트 상세"
        subtitle="합성 데이터로 재현한 점포 위험 발동 흐름"
        actions={
          <Button variant="secondary" size="md" onClick={() => navigate('/enterprise')}>
            대시보드로
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* 발동 요약 */}
        <section
          aria-labelledby="risk-siren-event-title"
          className="flex flex-col gap-6 overflow-hidden rounded-panel border border-line bg-canvas lg:flex-row lg:items-stretch"
        >
          <div className="flex min-w-0 flex-auto gap-4 p-5 lg:p-6">
            <span className="w-1 flex-none self-stretch rounded-full bg-danger" aria-hidden="true" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="danger" variant="fill" size="sm">
                  위험 이벤트 발동
                </Badge>
                <span className="text-bodysm text-muted">{event.evaluatedAt} 분석</span>
              </div>
              <h2 id="risk-siren-event-title" className="mt-2 text-h3 text-fg">
                {event.brandName}
              </h2>
              <p className="mt-1 text-bodysm text-muted">
                {event.area} · {event.industry} · 점포 ID{' '}
                <span className="num">{event.branchId}</span>
              </p>
              <p className="mt-3 max-w-[64ch] text-body text-body">
                종합 위험도{' '}
                <span className="num font-semibold text-fg">{event.threshold}점</span> 기준을
                초과했습니다. 아래 근거를 확인한 뒤 점주와 본사의 후속 조치를 시작할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex flex-none gap-4 border-t border-line p-5 lg:border-l lg:border-t-0 lg:p-6">
            <div className="min-w-[130px] rounded-ctl-md bg-surface px-4 py-3">
              <span className="block text-bodysm text-muted">현재 위험도</span>
              <strong className="num mt-1 block text-h1 text-risk-danger">
                {event.score.toFixed(1)}
              </strong>
              <RiskText level="danger" className="mt-1 block text-bodysm">
                {event.grade}
              </RiskText>
            </div>
            <div className="hidden min-w-[120px] rounded-ctl-md bg-surface px-4 py-3 sm:block">
              <span className="block text-bodysm text-muted">발동 기준</span>
              <strong className="num mt-1 block text-h3 text-fg">{event.threshold}점</strong>
              <span className="mt-1 block text-bodysm text-muted">초과 감지</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
          <Card title="발동 근거" description="점수에 기여한 신호">
            <div className="flex flex-col">
              {event.signals.map((signal) => (
                <div key={signal.id} className="border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] text-muted">{signal.id}</span>
                        <h3 className="text-body font-semibold text-fg">{signal.label}</h3>
                        {signal.synthetic && (
                          <Badge tone="neutral" size="xs">
                            합성
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-bodysm text-muted">{signal.detail}</p>
                    </div>
                    <div className="flex-none text-right">
                      <RiskText level={signal.level} className="num text-h4">
                        {signal.value}
                      </RiskText>
                      <span className="num mt-0.5 block text-bodysm text-muted">
                        신호점수 {signal.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface"
                    role="img"
                    aria-label={`${signal.label} 신호점수 ${signal.score.toFixed(1)}점 / 100점`}
                  >
                    <div
                      className={`h-full rounded-full ${signalBarClass(signal.level)}`}
                      style={{ width: `${Math.min(signal.score, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 truncate font-mono text-[12px] text-muted" title={signal.source}>
                    source · {signal.source}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="이벤트 처리">
            <div className="flex flex-col gap-5">
              <div className="rounded-ctl-md bg-surface p-4">
                <span className="block text-bodysm text-muted">현재 처리 상태</span>
                <strong className="mt-1 block text-h4 text-fg">
                  {acknowledged ? '조치 확인됨' : '확인 필요'}
                </strong>
                <p className="mt-2 text-bodysm text-muted">
                  {acknowledged
                    ? '이 화면에서 확인 상태로 표시했습니다. 저장 API 연결 전까지는 데모 상태입니다.'
                    : '위험 근거를 확인하고 담당자의 후속 조치를 시작하세요.'}
                </p>
              </div>

              <dl className="flex flex-col gap-3 text-bodysm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">알림 대상</dt>
                  <dd className="text-right font-medium text-fg">{event.recipients.join(' · ')}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">전송 상태</dt>
                  <dd className="text-right font-medium text-fg">{event.dispatchStatus}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">정책 버전</dt>
                  <dd className="text-right font-mono text-[12px] text-fg">{event.policyVersion}</dd>
                </div>
              </dl>

              <div className="flex flex-col gap-2">
                <Button size="lg" block onClick={() => setAcknowledged((value) => !value)}>
                  {acknowledged ? '확인 상태 되돌리기' : '조치 확인으로 표시'}
                </Button>
                <Button variant="secondary" size="lg" block onClick={copyEventId}>
                  {copied ? '이벤트 ID를 복사했습니다' : '이벤트 ID 복사'}
                </Button>
              </div>
              <p className="text-bodysm text-muted">
                실제 이메일·외부 발송은 아직 비활성화되어 있습니다. 이 화면은 발동 이벤트와
                대상자를 검증하는 운영 UI입니다.
              </p>
            </div>
          </Card>
        </div>

        <Card title="이벤트 타임라인" description={event.eventId}>
          <ol className="m-0 flex list-none flex-col p-0">
            {event.timeline.map((item, index) => (
              <li key={`${item.time}-${item.label}`} className="relative flex gap-4 pb-6 last:pb-0">
                {index < event.timeline.length - 1 && (
                  <span
                    className="absolute left-[5px] top-4 h-full w-px bg-line"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={[
                    'relative mt-1.5 size-2.5 shrink-0 rounded-full',
                    item.state === 'done' ? 'bg-body' : 'bg-danger',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <h3 className="text-body font-semibold text-fg">{item.label}</h3>
                    <p className="mt-1 text-bodysm text-muted">{item.detail}</p>
                  </div>
                  <span className="num shrink-0 text-bodysm text-muted">{item.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <section className="rounded-panel bg-surface px-5 py-4 lg:px-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="min-w-0">
              <h2 className="text-body font-semibold text-fg">데이터 고지</h2>
              <p className="mt-1 text-bodysm text-muted">{event.disclosure}</p>
            </div>
            <span className="num shrink-0 font-mono text-[12px] text-muted">
              {event.evidenceIds.length} evidence IDs
            </span>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}

export default RiskSirenPage
