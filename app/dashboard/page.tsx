'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser, saveSession } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { ApiUser, Song } from '@/lib/api'

function StatCard({ label, value, sub, icon }: { label: string; value: string|number; sub?: string; icon: string }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{icon} {label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function SkeletonStat() {
  return <div className="stat-card"><div className="skeleton" style={{height:14,width:'60%',marginBottom:10}} /><div className="skeleton" style={{height:28,width:'40%'}} /></div>
}

export default function DashboardPage() {
  const [user, setUser] = useState<ApiUser | null>(getStoredUser())
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }

    Promise.allSettled([
      apiGet<ApiUser>('/api/me'),
      apiGet<{ songs: Song[] }>('/api/songs?limit=5'),
    ]).then(([userRes, songsRes]) => {
      if (userRes.status === 'fulfilled') {
        setUser(userRes.value)
        saveSession(localStorage.getItem('accessToken') || '', userRes.value)
      } else {
        setError(userRes.reason?.message || 'فشل تحميل بيانات المستخدم')
      }
      if (songsRes.status === 'fulfilled') {
        setSongs(songsRes.value?.songs || [])
      }
    }).finally(() => setLoading(false))
  }, [])

  const tierLabel: Record<string, string> = {
    FREE: 'مجاني', STARTER: 'مبتدئ', PRO: 'احترافي', BUSINESS: 'أعمال', ENTERPRISE: 'مؤسسي'
  }

  return (
    <Shell>
      {error && <div className="error">{error}</div>}

      {/* Stats */}
      <div className="stats-grid">
        {loading ? (
          Array.from({length:4}).map((_,i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard icon="💎" label="Credits المتبقية" value={user?.credits ?? 0} sub="تُجدَّد مع الاشتراك" />
            <StatCard icon="🎵" label="أغاني مولَّدة" value={user?.totalSongsGenerated ?? 0} sub="إجمالي" />
            <StatCard icon="🏆" label="الخطة الحالية" value={tierLabel[user?.tier || 'FREE'] || user?.tier || 'FREE'} />
            <StatCard icon="👤" label="الحساب" value={user?.email?.split('@')[0] || '-'} sub={user?.email} />
          </>
        )}
      </div>

      {/* Recent Songs */}
      <div className="page-header">
        <h1 style={{fontSize:18,margin:0}}>أحدث الأغاني</h1>
        <a href="/studio" className="btn sm">+ أغنية جديدة</a>
      </div>

      {loading ? (
        <div className="card"><div className="skeleton" style={{height:14,marginBottom:10}} /><div className="skeleton" style={{height:14,width:'70%'}} /></div>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h3>لا توجد أغاني بعد</h3>
          <p>ابدأ بإنشاء أغنيتك الأولى في AI Studio</p>
          <a href="/studio" className="btn mt-4">🚀 ابدأ الآن</a>
        </div>
      ) : (
        <div style={{display:'grid',gap:10}}>
          {songs.map(song => (
            <div key={song.id} className="song-card">
              <div className="song-thumb">🎵</div>
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-meta">{song.genre} · {song.mood}</div>
              </div>
              <div className="song-actions">
                <span className={`pill ${song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'}`}>
                  {song.status === 'COMPLETED' ? '✅' : song.status === 'FAILED' ? '❌' : '⏳'}{' '}
                  {song.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid-3 mt-6">
        {[
          { href:'/studio',  icon:'🎵', title:'AI Studio',       desc:'أنشئ أغنية جديدة الآن' },
          { href:'/credits', icon:'💎', title:'شراء Credits',     desc:'وسّع رصيدك للمزيد' },
          { href:'/billing', icon:'💳', title:'إدارة الاشتراك',   desc:'ترقية أو إدارة الباقة' },
        ].map(action => (
          <a key={action.href} href={action.href} className="card hover" style={{cursor:'pointer',display:'block'}}>
            <div className="card-icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p className="muted text-sm">{action.desc}</p>
          </a>
        ))}
      </div>
    </Shell>
  )
}
