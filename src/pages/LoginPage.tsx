import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPanel from '../components/domain/LoginPanel'
import { ApiError } from '../api'
import { useSession } from '../session/useSession'

/** 로그인 화면 — 좌: 기업용 로그인, 우: 사업자용 로그인. */
function LoginPage() {
  const { login, pending } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setError(null)
    try {
      const user = await login(email, password)
      // 어느 칸으로 로그인했든 서버가 정한 역할로 보낸다.
      navigate(user.role === 'enterprise' ? '/enterprise' : '/owner')
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : '로그인 중 문제가 발생했습니다',
      )
    }
  }

  return (
    <div className="flex flex-col flex-auto min-h-[100svh] bg-w-page text-w-ink">
      <header className="flex flex-none items-center h-16 px-5 text-[22px] border-b border-w-line lg:h-[90px] lg:text-[30px]">
        서비스명
      </header>

      {error && (
        <p
          role="alert"
          className="flex-none mx-5 mt-5 p-3 text-[15px] text-w-ink bg-w-field border border-w-line rounded-[10px] lg:mx-6"
        >
          {error}
        </p>
      )}

      <div className="flex-auto grid grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-5 py-10 lg:px-6 lg:py-16">
          <LoginPanel title="기업용 로그인" pending={pending} onSubmit={handleLogin} />
        </section>
        <section className="flex items-center justify-center px-5 py-10 border-t border-w-line lg:px-6 lg:py-16 lg:border-t-0 lg:border-l">
          <LoginPanel
            title="사업자용 로그인"
            showSocialLogin
            pending={pending}
            onSubmit={handleLogin}
          />
        </section>
      </div>
    </div>
  )
}

export default LoginPage
