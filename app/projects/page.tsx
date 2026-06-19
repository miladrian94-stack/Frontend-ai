'use client'
import { Shell } from '@/components/Shell'
import { apiGet, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'

type Song = Record<string, unknown>

export default function ProjectsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL'|'COMPLETED'|'PENDING'|'FAILED'>('ALL')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    apiGet<{ songs: Song[] }>('/api/songs?limit=50')
      .then(d => setSongs(d?.songs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? songs : songs.filter(s => s.status === filter)

  return (
    <Shell>
      <div className="page-header">
        <h1>المشاريع والأغاني</h1>
        <a href="/studio" className="btn sm">+ أغنية جديدة</a>
      </div>

      <div className="tabs">
        {(['ALL','COMPLETED','PENDING','FAILED'] as const).map(f => (
          <button key={f} className={`tab${filter===f?' active':''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'الكل' : f === 'COMPLETED' ? '✅ مكتمل' : f === 'PENDING' ? '⏳ قيد التنفيذ' : '❌ فشل'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{display:'grid',gap:10}}>
          {Array.from({length:5}).map((_,i) => (
            <div key={i} className="card"><div className="skeleton" style={{height:56}} /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>لا توجد أغاني</h3>
          <p>ابدأ بإنشاء أغنيتك في AI Studio</p>
          <a href="/studio" className="btn mt-4">🎵 AI Studio</a>
        </div>
      ) : (
        <div style={{display:'grid',gap:10}}>
          {filtered.map(song => (
            <div key={String(song.id)} className="song-card">
              <div className="song-thumb">🎵</div>
              <div className="song-info">
                <div className="song-title">{String(song.title || 'Untitled')}</div>
                <div className="song-meta">
                  {String(song.genre || '')} · {String(song.mood || '')} · {String(song.language || '')} ·{' '}
                  {new Date(String(song.createdAt)).toLocaleDateString('ar')}
                </div>
                {song.status === 'PROCESSING' && (
                  <div className="progress-bar" style={{marginTop:6}}>
                    <div className="progress-fill" style={{width:`${song.progress || 0}%`}} />
                  </div>
                )}
              </div>
              <div className="song-actions">
                <span className={`pill ${song.status === 'COMPLETED' ? 'green' : song.status === 'FAILED' ? 'red' : 'amber'}`}>
                  {String(song.status)}
                </span>
                {song.audioUrl && (
                  <a href={String(song.audioUrl)} download className="btn sm outline">⬇️</a>
                )}
                {song.isFavorite ? '⭐' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}
