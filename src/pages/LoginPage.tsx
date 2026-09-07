import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPanel from '../components/domain/LoginPanel'
import { ApiError } from '../api'
import { useSession } from '../session/useSession'

/**
 * 로그인 화면 — 좌: 기업용, 우: 사업자용.
 *
 * 두 패널은 흰 canvas 카드로 두고 페이지 배경만 `surface` 로 낮춰 대비를 만든다.
 * 어느 칸으로 로그인했든 이동 경로는 서버가 준 역할로 결정한다 (기존 동작 유지).
 */
function LoginPage() {
  const { login, pending } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setError(null)
    try {
      const user = await login(email, password)
      navigate(user.role === 'enterprise' ? '/enterprise' : '/owner')
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : '로그인 중 문제가 발생했습니다')
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-auto flex-col bg-surface text-body">
      <header className="flex-none border-b border-line bg-canvas">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center px-5 lg:h-16 lg:px-8">
          <span className="text-[19px] font-bold tracking-[-0.02em] text-fg lg:text-[21px]">
            safeOn
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-auto flex-col justify-center px-5 py-10 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-2 text-center lg:mb-12">
          <h1 className="text-h2 text-fg lg:text-h1">점포 운영, 숫자로 답을 찾으세요</h1>
          <p className="text-body text-muted">
            운영 위험도와 신규 입지 분석을 한 화면에서 확인합니다.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-auto mb-6 w-[min(880px,100%)] rounded-ctl-md border border-danger bg-danger/5 px-4 py-3 text-bodysm text-danger"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-2">
          <LoginPanel
            title="기업용 로그인"
            description="본사에서 가맹 점포 위험도와 랭킹을 관리합니다."
            pending={pending}
            onSubmit={handleLogin}
          />
          <LoginPanel
            title="사업자용 로그인"
            description="내 점포의 보고서를 작성하고 위험도를 확인합니다."
            showSocialLogin
            pending={pending}
            onSubmit={handleLogin}
          />
        </div>
      </main>
    </div>
  )
}

export default LoginPage
