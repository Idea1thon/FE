import { useState } from 'react'
import type { FormEvent } from 'react'
import TextField from '../ui/TextField'
import Button from '../ui/Button'

interface LoginPanelProps {
  title: string
  /** One line explaining who this panel is for. */
  description?: string
  /** Show the 간편로그인 placeholder row (사업자용 only). */
  showSocialLogin?: boolean
  /** 로그인 요청 진행 중. */
  pending?: boolean
  onSubmit: (email: string, password: string) => void
}

/**
 * 로그인 카드 — 기업용 / 사업자용 공통.
 *
 * The submit control is the TDS xlarge button (56px / 16px radius / 17px-600),
 * which DESIGN.md names as the documented default and as the strong touch
 * action. Its loading state preserves width, so the card does not reflow while
 * the request is in flight.
 */
function LoginPanel({
  title,
  description,
  showSocialLogin = false,
  pending = false,
  onSubmit,
}: LoginPanelProps) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(id.trim(), pw)
  }

  return (
    <form
      className="flex w-[min(420px,100%)] flex-col gap-6 rounded-panel border border-line bg-canvas p-6 lg:p-8"
      onSubmit={submit}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-fg">{title}</h2>
        {description && <p className="text-bodysm text-muted">{description}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <TextField
          label="이메일"
          variant="big"
          type="email"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="name@company.com"
          autoComplete="username"
          required
        />
        <TextField
          label="비밀번호"
          variant="big"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" size="xl" block loading={pending}>
        로그인
      </Button>

      {showSocialLogin && (
        <div className="flex flex-col items-center gap-4 border-t border-line pt-6">
          <span className="text-bodysm text-muted">간편로그인</span>
          <div className="flex gap-4">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className="size-12 cursor-pointer rounded-full border border-line bg-surface transition-colors duration-150 hover:bg-line/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`간편로그인 ${n}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-6 border-t border-line pt-6 text-bodysm">
        <a
          href="#signup"
          className="font-medium text-body no-underline transition-colors duration-150 hover:text-primary"
        >
          회원가입
        </a>
        <span className="text-line" aria-hidden="true">
          |
        </span>
        <a
          href="#find"
          className="font-medium text-body no-underline transition-colors duration-150 hover:text-primary"
        >
          아이디 · 비밀번호 찾기
        </a>
      </div>
    </form>
  )
}

export default LoginPanel
