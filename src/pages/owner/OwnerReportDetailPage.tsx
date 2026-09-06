import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import PublishToggle from '../../components/ui/PublishToggle'
import ReportViewer from '../../components/domain/ReportViewer'
import ConfirmDialog from '../../components/modals/ConfirmDialog'
import { currentStore, getReport } from '../../data/mock'

/** 운영보고서 상세 (사업자 로그인 — 수정 / 삭제 / 공개 설정). */
function OwnerReportDetailPage() {
  const { reportId } = useParams()
  // Remount on report change so the edit/publish state is seeded fresh.
  return <OwnerReportDetail key={reportId} reportId={reportId} />
}

function OwnerReportDetail({ reportId }: { reportId: string | undefined }) {
  const navigate = useNavigate()
  const report = getReport(reportId)

  const [published, setPublished] = useState(report.published)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(report.content)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <PageContainer width="narrow">
      <PageHeading
        size="lg"
        backTo="/owner/reports"
        eyebrow={`${currentStore.region} · ${currentStore.name}`}
        title={report.period}
        subtitle={`위험도 ${report.riskPercent}`}
        actions={
          <>
            <PublishToggle published={published} onChange={setPublished} />
            <Button variant={editing ? 'primary' : 'secondary'} size="md" onClick={() => setEditing((v) => !v)}>
              {editing ? '저장' : '수정'}
            </Button>
            <Button variant="ghost" size="md" onClick={() => setConfirmOpen(true)}>
              삭제
            </Button>
          </>
        }
      />

      <ReportViewer content={content} editing={editing} onChange={setContent} />

      <ConfirmDialog
        open={confirmOpen}
        ariaLabel="보고서 삭제"
        title="보고서를 삭제할까요?"
        lines={[
          `${report.period} 보고서와 함께 계산된 위험도 분석도 사라집니다.`,
          '삭제하면 되돌릴 수 없습니다.',
        ]}
        confirmLabel="삭제"
        destructive
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          navigate('/owner/reports')
        }}
      />
    </PageContainer>
  )
}

export default OwnerReportDetailPage
