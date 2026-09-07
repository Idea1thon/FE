import { useState } from 'react'
import type { FormEvent } from 'react'
import TextField from '../ui/TextField'
import Button from '../ui/Button'

interface LoginPanelProps {
  title: string
  /** One line explaining who this panel is for. */
  description?: string
  /** Show the 간편로그인 row (사업자용 only). Still disabled until wired. */
  showSocialLogin?: boolean
  /** 로그인 요청 진행 중. */
  pending?: boolean
  onSubmit: (email: string, password: string) => void
}

/**
 * 로그인 카드 — 기업용 / 사업자용 공통.
 *
 * 간편로그인·회원가입·ID/PW 찾기는 아직 연결되지 않았으므로 **비활성 + "(준비 중)"**
 * 으로 남긴다. 눌리는 것처럼 보이는데 아무 일도 없으면 그게 더 나쁜 상태다.
 *
 * 제출 버튼은 TDS xlarge(56px / 16px radius / 17px-600)이고 loading 중에도 폭을
 * 유지한다.
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
          <span className="text-bodysm text-muted">간편로그인 (준비 중)</span>
          <div className="flex gap-4">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                disabled
                className="size-12 rounded-full border border-line bg-surface opacity-40 cursor-not-allowed"
                aria-label={`간편로그인 ${n} (준비 중)`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-6 border-t border-line pt-6 text-bodysm text-muted">
        <span>회원가입 (준비 중)</span>
        <span className="text-line" aria-hidden="true">
          |
        </span>
        <span>아이디 · 비밀번호 찾기 (준비 중)</span>
      </div>
    </form>
  )
}

export default LoginPanel
