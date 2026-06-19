import { API_URL } from '@/lib/api'

type HealthData = {
  status?: string;
  timestamp?: string;
  services?: Record<string, { status: string; latency?: number; message?: string }>;
  [key: string]: unknown;
}

async function getHealth(): Promise<HealthData> {
  try {
    const res = await fetch(`${API_URL}/api/system/health`, { cache: 'no-store' })
    return await res.json()
  } catch {
    try {
      const res = await fetch(`${API_URL}/api/health`, { cache: 'no-store' })
      return await res.json()
    } catch (e: unknown) {
      return { status: 'error', error: e instanceof Error ? e.message : 'Connection failed' }
    }
  }
}

function StatusDot({ status }: { status: string }) {
  const cls = status === 'healthy' || status === 'ok' ? 'healthy' : status === 'warning' ? 'warning' : status === 'error' || status === 'critical' ? 'critical' : 'unknown'
  return <div className={`health-dot ${cls}`} />
}

function StatusPill({ status }: { status: string }) {
  const isOk = status === 'healthy' || status === 'ok'
  const isWarn = status === 'warning'
  return (
    <span className={`pill ${isOk ? 'green' : isWarn ? 'amber' : 'red'}`}>
      {isOk ? '✅' : isWarn ? '⚠️' : '❌'} {status}
    </span>
  )
}

export default async function StatusPage() {
  const data = await getHealth()
  const overallOk = data.status === 'healthy' || data.status === 'ok'

  const KNOWN_SERVICES = ['database', 'redis', 'storage', 'stripe', 'api', 'workers', 'queue']

  return (
    <main style={{minHeight:'100vh',background:'#050816',padding:'0 0 60px'}}>
      <nav style={{padding:'20px 48px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(5,8,22,.9)',backdropFilter:'blur(12px)'}}>
        <div style={{fontSize:20,fontWeight:900,background:'linear-gradient(90deg,#fff,#a5b4fc)',WebkitBackgroundClip:'text',color:'transparent'}}>
          🎵 Melody AI
        </div>
        <a href="/" style={{color:'#a5b4fc',fontSize:14}}>← الرئيسية</a>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:48,marginBottom:12}}>{overallOk ? '✅' : '❌'}</div>
          <h1 style={{fontSize:28,fontWeight:900,margin:'0 0 8px'}}>حالة النظام</h1>
          <StatusPill status={data.status || 'unknown'} />
          {data.timestamp && (
            <p style={{color:'#64748b',fontSize:13,marginTop:10}}>
              آخر تحديث: {new Date(String(data.timestamp)).toLocaleString('ar')}
            </p>
          )}
        </div>

        {/* Services */}
        {data.services ? (
          <div className="health-grid" style={{marginBottom:32}}>
            {Object.entries(data.services as Record<string, { status: string; latency?: number; message?: string }>).map(([name, svc]) => (
              <div key={name} className="health-item">
                <div>
                  <div className="health-name">{name.toUpperCase()}</div>
                  {svc.latency && <div style={{fontSize:12,color:'#64748b'}}>{svc.latency}ms</div>}
                  {svc.message && <div style={{fontSize:11,color:'#64748b'}}>{svc.message}</div>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <StatusDot status={svc.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="health-grid" style={{marginBottom:32}}>
            {KNOWN_SERVICES.map(svc => (
              <div key={svc} className="health-item">
                <div className="health-name">{svc.toUpperCase()}</div>
                <div className="health-dot unknown" />
              </div>
            ))}
          </div>
        )}

        {/* Raw JSON */}
        <div className="card">
          <h3 style={{marginTop:0}}>📊 تفاصيل الاستجابة</h3>
          <pre className="pre" style={{margin:0}}>{JSON.stringify(data, null, 2)}</pre>
        </div>

        {/* API Endpoints */}
        <div className="card" style={{marginTop:16}}>
          <h3 style={{marginTop:0}}>🔗 API Endpoints</h3>
          <div style={{display:'grid',gap:8}}>
            {[
              { path: '/api/health',        label: 'Health Check' },
              { path: '/api/system/health', label: 'System Health' },
              { path: '/api/auth/login',    label: 'Login (POST)' },
              { path: '/api/auth/register', label: 'Register (POST)' },
              { path: '/api/songs',         label: 'Songs (GET/POST)' },
            ].map(ep => (
              <div key={ep.path} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                <span style={{fontSize:13,color:'#94a3b8'}}>{ep.label}</span>
                <a href={`${API_URL}${ep.path}`} target="_blank" rel="noopener"
                  style={{fontSize:12,color:'#a5b4fc',fontFamily:'monospace'}}>{ep.path} ↗</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
