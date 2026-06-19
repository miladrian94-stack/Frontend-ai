'use client'
import { Shell } from '@/components/Shell'
import { apiGet, apiPatch, getStoredUser, saveSession } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { ApiUser } from '@/lib/api'

export default function SettingsPage() {
  const [user, setUser] = useState<ApiUser | null>(getStoredUser())
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    apiGet<ApiUser>('/api/me').then(u => { setUser(u); setName(u.name || '') }).catch(() => {})
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const updated = await apiPatch<ApiUser>('/api/me', { name })
      setUser(updated)
      saveSession(localStorage.getItem('accessToken') || '', updated)
      setSuccess('تم حفظ التغييرات بنجاح!')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل الحفظ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="page-header"><h1>الإعدادات</h1></div>

      <div className="grid-2" style={{alignItems:'start'}}>
        {/* Profile */}
        <div className="card">
          <h3 style={{marginTop:0}}>👤 الملف الشخصي</h3>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <form onSubmit={save}>
            <div className="field">
              <label>الاسم</label>
              <input value={name} onChange={e => setName(e.target.value)} required minLength={2} />
            </div>
            <div className="field">
              <label>البريد الإلكتروني</label>
              <input value={user?.email || ''} disabled style={{opacity:.5,cursor:'not-allowed'}} />
            </div>
            <button className="btn" disabled={loading}>{loading ? '⏳...' : 'حفظ التغييرات'}</button>
          </form>
        </div>

        {/* Account Info */}
        <div>
          <div className="card" style={{marginBottom:16}}>
            <h3 style={{marginTop:0}}>📊 معلومات الحساب</h3>
            {[
              { label: 'الدور', value: user?.role },
              { label: 'الخطة', value: user?.tier },
              { label: 'Credits', value: String(user?.credits ?? 0) },
              { label: 'أغاني مولَّدة', value: String(user?.totalSongsGenerated ?? 0) },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center" style={{padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                <span className="muted text-sm">{item.label}</span>
                <span style={{fontWeight:600,fontSize:14}}>{item.value || '-'}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{marginTop:0}}>🔐 الأمان</h3>
            <a href="/forgot-password" className="btn outline full">تغيير كلمة المرور</a>
          </div>
        </div>
      </div>
    </Shell>
  )
}
