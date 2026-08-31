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
    <PageContainer>
      <PageHeading
        size="lg"
        title={`${currentStore.region} | ${currentStore.name} 운영보고서`}
        meta={report.period}
        subtitle={currentStore.manager}
        actions={
          <>
            <PublishToggle published={published} onChange={setPublished} />
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <Button onClick={() => setEditing((v) => !v)}>
                {editing ? '보고서 저장' : '보고서 수정'}
              </Button>
              <Button onClick={() => setConfirmOpen(true)}>보고서 삭제</Button>
            </div>
          </>
        }
      />

      <ReportViewer content={content} editing={editing} onChange={setContent} />

      <ConfirmDialog
        open={confirmOpen}
        ariaLabel="보고서 삭제"
        lines={['보고서를 삭제하면 복구되지 않습니다.', '삭제하시겠습니까?']}
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
