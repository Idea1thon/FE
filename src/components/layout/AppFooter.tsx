/**
 * Footer.
 *
 * Kept deliberately quiet: it sits on the neutral `surface` layer with a
 * hairline above, so it closes the page without competing with the content.
 * The copy is a placeholder the wireframe never specified — it is not presented
 * as real company information.
 */
function AppFooter() {
  return (
    <footer className="mt-auto flex-none border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-8 sm:px-6 lg:px-8">
        <p className="text-bodysm font-semibold text-body">safeOn</p>
        <p className="text-bodysm text-muted">
          점포 운영 위험도와 신규 입지 분석을 한곳에서 확인하세요.
        </p>
      </div>
    </footer>
  )
}

export default AppFooter
