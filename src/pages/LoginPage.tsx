import { useNavigate } from 'react-router-dom'
import LoginPanel from '../components/domain/LoginPanel'
import { useSession } from '../session/useSession'
import type { Role } from '../session/SessionContext'

/** 로그인 화면 — 좌: 기업용 로그인, 우: 사업자용 로그인. */
function LoginPage() {
  const { login } = useSession()
  const navigate = useNavigate()

  const handleLogin = (role: Role) => {
    login(role)
    navigate(role === 'enterprise' ? '/enterprise' : '/owner')
  }

  return (
    <div className="flex flex-col flex-auto min-h-[100svh] bg-w-page text-w-ink">
      <header className="flex flex-none items-center h-16 px-5 text-[22px] border-b border-w-line lg:h-[90px] lg:text-[30px]">
        서비스명
      </header>
      <div className="flex-auto grid grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-5 py-10 lg:px-6 lg:py-16">
          <LoginPanel title="기업용 로그인" onSubmit={() => handleLogin('enterprise')} />
        </section>
        <section className="flex items-center justify-center px-5 py-10 border-t border-w-line lg:px-6 lg:py-16 lg:border-t-0 lg:border-l">
          <LoginPanel
            title="사업자용 로그인"
            showSocialLogin
            onSubmit={() => handleLogin('owner')}
          />
        </section>
      </div>
    </div>
  )
}

export default LoginPage
