'use client'
import Link from 'next/link'
import { useState } from 'react'
import { apiPost } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await apiPost('/api/auth/forgot-password', { email })
      setStatus('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
      setStatus('idle')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card card">
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:32,marginBottom:8}}>🔑</div>
          <h1 style={{margin:'0 0 6px',fontSize:22,fontWeight:900}}>نسيت كلمة المرور؟</h1>
          <p className="muted text-sm">سنرسل لك رابط إعادة التعيين على بريدك</p>
        </div>

        {status === 'done' ? (
          <div className="success">
            ✅ تم الإرسال! تحقق من بريدك الإلكتروني (قد يكون في Spam).
            <br/><br/>
            <Link href="/login" style={{color:'#6ee7b7',fontWeight:600}}>← العودة لتسجيل الدخول</Link>
          </div>
        ) : (
          <>
            {error && <div className="error">{error}</div>}
            <form onSubmit={submit}>
              <div className="field">
                <label>البريد الإلكتروني</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required />
              </div>
              <button className="btn full" disabled={status === 'loading'}>
                {status === 'loading' ? '⏳ جاري الإرسال...' : 'إرسال رابط التعيين'}
              </button>
            </form>
          </>
        )}

        <p className="muted text-sm" style={{textAlign:'center',marginTop:16}}>
          <Link href="/login" style={{color:'#a5b4fc'}}>← العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </main>
  )
}
