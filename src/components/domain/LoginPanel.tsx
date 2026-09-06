import { useState } from 'react'
import type { FormEvent } from 'react'
import TextField from '../ui/TextField'

interface LoginPanelProps {
  title: string
  /** Show the 간편로그인 social buttons (사업자용 로그인 only). */
  showSocialLogin?: boolean
  /** 로그인 요청 진행 중이면 버튼을 잠근다. */
  pending?: boolean
  onSubmit: (email: string, password: string) => void
}

/** 로그인 카드 — 기업용 / 사업자용 공통. */
function LoginPanel({
  title,
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
      className="flex flex-col gap-6 w-[min(457px,100%)] p-10 bg-w-panel border border-w-line rounded-[20px]"
      onSubmit={submit}
    >
      <h2 className="text-[30px] font-normal text-center text-w-ink">{title}</h2>

      <div className="flex flex-col gap-3">
        <TextField
          label="ID"
          inputSize="lg"
          type="email"
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
          required
        />
        <TextField
          label="PW"
          type="password"
          inputSize="lg"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {showSocialLogin && (
        <div className="flex flex-col items-center gap-4 pt-5 border-t border-w-line">
          <span className="text-[18px] text-w-ink">간편로그인</span>
          <div className="flex gap-8">
            <button
              type="button"
              className="w-[59px] h-[59px] rounded-full bg-w-social border-0 cursor-pointer"
              aria-label="간편로그인 1"
            />
            <button
              type="button"
              className="w-[59px] h-[59px] rounded-full bg-w-social border-0 cursor-pointer"
              aria-label="간편로그인 2"
            />
            <button
              type="button"
              className="w-[59px] h-[59px] rounded-full bg-w-social border-0 cursor-pointer"
              aria-label="간편로그인 3"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="p-3 text-[18px] text-w-ink bg-w-field border border-w-line rounded-[10px] cursor-pointer hover:bg-w-row disabled:cursor-progress disabled:opacity-60"
      >
        {pending ? '로그인 중…' : '로그인'}
      </button>

      <div className="flex justify-center gap-10 pt-5 border-t border-w-line text-[15px]">
        <a href="#signup" className="text-w-ink no-underline hover:underline">
          회원가입
        </a>
        <a href="#find" className="text-w-ink no-underline hover:underline">
          ID/PW 찾기
        </a>
      </div>
    </form>
  )
}

export default LoginPanel
