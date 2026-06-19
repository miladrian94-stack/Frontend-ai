'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'

type AdminStats = {
  users?: { total?: number; active?: number; newThisMonth?: number }
  songs?: { total?: number; thisMonth?: number }
  revenue?: { mrr?: number; arr?: number }
  credits?: { totalGranted?: number; totalUsed?: number }
}

type AdminUser = {
  id: string; email: string; name?: string; tier?: string;
  role?: string; credits?: number; createdAt: string; isActive?: boolean
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({})
  const [users, setUsers] = useState<AdminUser[]>([])
  const [tab, setTab] = useState<'overview'|'users'|'logs'>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const u = getStoredUser()
    if (!u) { window.location.href = '/login'; return }
    if (u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN') {
      window.location.href = '/dashboard'; return
    }
    Promise.allSettled([
      apiGet<AdminStats>('/api/admin/analytics'),
      apiGet<{ users: AdminUser[] }>('/api/admin/users'),
    ]).then(([s, u]) => {
      if (s.status === 'fulfilled') setStats(s.value || {})
      if (u.status === 'fulfilled') setUsers(u.value?.users || [])
      if (s.status === 'rejected') setError(s.reason?.message)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <Shell>
      <div className="page-header">
        <h1>🛡️ Admin Panel</h1>
        <span className="pill red">ADMIN ACCESS</span>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tabs">
        {(['overview','users','logs'] as const).map(t => (
          <button key={t} className={`tab${tab===t?' active':''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📊 Overview' : t === 'users' ? '👥 Users' : '📋 Audit Logs'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="stats-grid">
            {loading ? Array.from({length:6}).map((_,i) => (
              <div key={i} className="stat-card"><div className="skeleton" style={{height:60}} /></div>
            )) : (
              <>
                <div className="stat-card"><div className="stat-label">👥 إجمالي المستخدمين</div><div className="stat-value">{stats.users?.total ?? 0}</div></div>
                <div className="stat-card"><div className="stat-label">✅ مستخدمون نشطون</div><div className="stat-value">{stats.users?.active ?? 0}</div></div>
                <div className="stat-card"><div className="stat-label">🆕 هذا الشهر</div><div className="stat-value">{stats.users?.newThisMonth ?? 0}</div></div>
                <div className="stat-card"><div className="stat-label">🎵 إجمالي الأغاني</div><div className="stat-value">{stats.songs?.total ?? 0}</div></div>
                <div className="stat-card"><div className="stat-label">💰 MRR</div><div className="stat-value">${stats.revenue?.mrr ?? 0}</div></div>
                <div className="stat-card"><div className="stat-label">💎 Credits مستخدمة</div><div className="stat-value">{stats.credits?.totalUsed ?? 0}</div></div>
              </>
            )}
          </div>

          <div className="grid-2 mt-6">
            <div className="card">
              <h3 style={{marginTop:0}}>🔗 روابط سريعة</h3>
              {[
                { href:'/api/admin/system', label:'System Health API' },
                { href:'/api/health', label:'Health Check API' },
                { href:'/status', label:'System Status Page' },
              ].map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener"
                  className="btn outline full" style={{marginBottom:10,display:'block'}}>
                  {link.label} ↗
                </a>
              ))}
            </div>
            <div className="card">
              <h3 style={{marginTop:0}}>⚙️ إجراءات</h3>
              <p className="muted text-sm" style={{marginBottom:14}}>إجراءات إدارية سريعة</p>
              <button className="btn outline full" style={{marginBottom:10}}
                onClick={() => apiGet('/api/admin/jobs').then(() => alert('تم!')).catch(e => alert(e.message))}>
                🔄 مراجعة Jobs المعلقة
              </button>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        loading ? <div className="card"><div className="skeleton" style={{height:300}} /></div> :
        users.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👥</div><h3>لا توجد بيانات</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>الخطة</th>
                  <th>الدور</th>
                  <th>Credits</th>
                  <th>الحالة</th>
                  <th>تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{fontWeight:600}}>{user.name || '-'}</div>
                      <div className="muted" style={{fontSize:12}}>{user.email}</div>
                    </td>
                    <td><span className="pill indigo">{user.tier || 'FREE'}</span></td>
                    <td><span className={`pill ${user.role === 'ADMIN' ? 'red' : 'gray'}`}>{user.role || 'USER'}</span></td>
                    <td>{user.credits ?? 0}</td>
                    <td><span className={`pill ${user.isActive ? 'green' : 'red'}`}>{user.isActive ? 'نشط' : 'معطل'}</span></td>
                    <td className="muted">{new Date(user.createdAt).toLocaleDateString('ar')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'logs' && (
        <div className="card">
          <h3 style={{marginTop:0}}>📋 Audit Logs</h3>
          <p className="muted">متاحة عبر API: <code>/api/admin/system</code></p>
          <button className="btn outline mt-4"
            onClick={() => apiGet('/api/admin/system').then(d => alert(JSON.stringify(d, null, 2))).catch(e => alert(e.message))}>
            تحميل System Info
          </button>
        </div>
      )}
    </Shell>
  )
}
