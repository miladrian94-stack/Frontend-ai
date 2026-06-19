'use client'
import { Shell } from '@/components/Shell'
import { apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'

type GenerateResult = {
  id?: string;
  title?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

const GENRES = ['POP','RAP','ROCK','EDM','ARABIC','KHALEEJI','YEMENI','LOFI','CINEMATIC','ACOUSTIC']
const MOODS = ['HAPPY','SAD','EPIC','ROMANTIC','EMOTIONAL','MOTIVATIONAL']
const LANGUAGES = [{ value:'ARABIC', label:'عربي' }, { value:'ENGLISH', label:'إنجليزي' }]
const VOICES = [{ value:'MALE', label:'ذكر' }, { value:'FEMALE', label:'أنثى' }]

export default function StudioPage() {
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('ARABIC')
  const [mood, setMood] = useState('HAPPY')
  const [language, setLanguage] = useState('ARABIC')
  const [voiceType, setVoiceType] = useState('MALE')
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [tab, setTab] = useState<'generate'|'history'>('generate')

  useEffect(() => { if (!getStoredUser()) window.location.href = '/login' }, [])

  async function generate() {
    if (!prompt.trim()) return
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = await apiPost<GenerateResult>('/api/songs', {
        title: title || prompt.slice(0, 50) || 'Untitled',
        prompt,
        genre,
        mood,
        language,
        voiceType,
        duration,
      })
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ في التوليد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="tabs">
        <button className={`tab${tab==='generate'?' active':''}`} onClick={() => setTab('generate')}>🎵 توليد أغنية</button>
        <button className={`tab${tab==='history'?' active':''}`} onClick={() => setTab('history')}>📜 السجل</button>
      </div>

      {tab === 'generate' && (
        <div className="grid-2" style={{alignItems:'start'}}>
          <div className="card">
            <h3 style={{marginTop:0}}>⚡ مولِّد الأغاني</h3>

            <div className="field">
              <label>عنوان الأغنية</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="اتركه فارغاً للتوليد التلقائي" />
            </div>

            <div className="field">
              <label>الفكرة / الكلمات *</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="اكتب فكرة الأغنية، المحتوى، أو الكلمات التي تريدها..." />
            </div>

            <div className="form-row">
              <div className="field">
                <label>النوع الموسيقي</label>
                <select value={genre} onChange={e => setGenre(e.target.value)}>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="field">
                <label>الحالة المزاجية</label>
                <select value={mood} onChange={e => setMood(e.target.value)}>
                  {MOODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>اللغة</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>الصوت</label>
                <select value={voiceType} onChange={e => setVoiceType(e.target.value)}>
                  {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <label>المدة: {duration} ثانية</label>
              <input type="range" min={30} max={300} step={15} value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                style={{width:'100%',accentColor:'#4f46e5'}} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="pill indigo">💎 تكلفة: 10 Credits</span>
              <button className="btn" onClick={generate} disabled={loading || !prompt.trim()}>
                {loading ? '⏳ جاري التوليد...' : '🚀 Generate'}
              </button>
            </div>
          </div>

          <div>
            {error && <div className="error">{error}</div>}
            {loading && (
              <div className="card">
                <h3 style={{marginTop:0}}>⏳ جاري التوليد...</h3>
                <div className="progress-bar mt-4">
                  <div className="progress-fill" style={{width:'60%',animation:'none'}} />
                </div>
                <p className="muted text-sm mt-4">قد يستغرق التوليد من 30 إلى 120 ثانية</p>
              </div>
            )}
            {result && (
              <div className="card">
                <h3 style={{marginTop:0}}>✅ تم إنشاء الطلب</h3>
                {result.id && (
                  <div className="flex items-center gap-3 mt-4">
                    <span className="pill green">ID: {String(result.id).slice(0, 8)}...</span>
                    <span className="pill amber">{String(result.status || 'PENDING')}</span>
                  </div>
                )}
                {result.title && <p className="mt-4"><strong>العنوان:</strong> {String(result.title)}</p>}
                {result.message && <p className="muted text-sm">{String(result.message)}</p>}
                <details className="mt-4">
                  <summary className="muted text-sm" style={{cursor:'pointer'}}>تفاصيل تقنية</summary>
                  <pre className="pre mt-4">{JSON.stringify(result, null, 2)}</pre>
                </details>
              </div>
            )}
            {!loading && !result && !error && (
              <div className="card" style={{textAlign:'center',padding:40}}>
                <div style={{fontSize:48,marginBottom:12}}>🎵</div>
                <p className="muted">سيظهر الناتج هنا بعد التوليد</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <SongHistory />
      )}
    </Shell>
  )
}

function SongHistory() {
  const [songs, setSongs] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/api').then(({ apiGet }) =>
      apiGet<{ songs: unknown[] }>('/api/songs').then(d => setSongs(d?.songs || [])).catch(() => {}).finally(() => setLoading(false))
    )
  }, [])

  if (loading) return <div className="card"><div className="skeleton" style={{height:100}} /></div>
  if (!songs.length) return (
    <div className="empty-state"><div className="empty-icon">🎵</div><h3>لا توجد أغاني بعد</h3></div>
  )

  return (
    <div style={{display:'grid',gap:10}}>
      {songs.map((song: unknown) => {
        const s = song as Record<string, unknown>
        return (
          <div key={String(s.id)} className="song-card">
            <div className="song-thumb">🎵</div>
            <div className="song-info">
              <div className="song-title">{String(s.title || 'Untitled')}</div>
              <div className="song-meta">{String(s.genre || '')} · {String(s.mood || '')} · {new Date(String(s.createdAt)).toLocaleDateString('ar')}</div>
            </div>
            <span className={`pill ${s.status === 'COMPLETED' ? 'green' : s.status === 'FAILED' ? 'red' : 'amber'}`}>
              {String(s.status)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
