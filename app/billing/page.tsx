'use client'
import { Shell } from '@/components/Shell'
import { apiGet, apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { Subscription } from '@/lib/api'

const PLANS = [
  {
    id: 'FREE', name: 'مجاني', price: '$0', desc: 'للتجربة',
    features: ['100 Credits/شهر', 'أغاني تصل إلى 60 ثانية', 'دعم عبر البريد'],
  },
  {
    id: 'PRO', name: 'احترافي', price: '$19', desc: '/شهر', popular: true,
    features: ['5,000 Credits/شهر', 'أغاني تصل إلى 5 دقائق', 'جميع الأنواع الموسيقية', 'أولوية في المعالجة', 'دعم فوري'],
  },
  {
    id: 'ENTERPRISE', name: 'مؤسسي', price: 'تواصل معنا', desc: '',
    features: ['Credits غير محدودة', 'API مخصص', 'SLA مضمون', 'مدير حساب مخصص', 'تكامل مخصص'],
  },
]

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [upgrading, setUpgrading] = useState<string|null>(null)

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    apiGet<{ subscription: Subscription }>('/api/subscriptions')
      .then(d => setSub(d?.subscription || null))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function upgrade(planId: string) {
    setUpgrading(planId)
    setError('')
    try {
      const data = await apiPost<{ url?: string; message?: string }>('/api/payments/checkout', { tier: planId })
      if (data?.url) window.location.href = data.url
      else alert(data?.message || 'تم الترقية!')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل الترقية')
    } finally {
      setUpgrading(null)
    }
  }

  async function openPortal() {
    try {
      const data = await apiPost<{ url?: string }>('/api/payments/billing')
      if (data?.url) window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل فتح بوابة الفواتير')
    }
  }

  const currentTier = getStoredUser()?.tier || 'FREE'

  return (
    <Shell>
      {error && <div className="error">{error}</div>}

      {/* Current Subscription */}
      {!loading && sub && (
        <div className="card" style={{marginBottom:24}}>
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-label">الاشتراك الحالي</div>
              <div style={{fontSize:22,fontWeight:800}}>{sub.tier}</div>
              <div className="muted text-sm">
                ينتهي في {new Date(sub.currentPeriodEnd).toLocaleDateString('ar')}
              </div>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <span className={`pill ${sub.status==='active'?'green':'amber'}`}>{sub.status}</span>
              <button className="btn outline sm" onClick={openPortal}>إدارة الاشتراك</button>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <h2 style={{margin:'0 0 16px',fontSize:18}}>خطط الاشتراك</h2>
      {loading ? (
        <div className="plans-grid">{Array.from({length:3}).map((_,i) => (
          <div key={i} className="plan-card"><div className="skeleton" style={{height:200}} /></div>
        ))}</div>
      ) : (
        <div className="plans-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.popular?' popular':''}`}>
              {plan.popular && <div className="plan-popular-badge">⭐ الأكثر شيوعاً</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}<span>{plan.desc}</span></div>
              <ul className="plan-features">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              {plan.id === 'ENTERPRISE' ? (
                <a href="mailto:sales@melodyai.com" className="btn outline full">تواصل معنا</a>
              ) : plan.id === currentTier ? (
                <button className="btn full" disabled style={{opacity:.5}}>✅ خطتك الحالية</button>
              ) : (
                <button className={`btn full${plan.popular?'':' outline'}`}
                  onClick={() => upgrade(plan.id)}
                  disabled={upgrading === plan.id}>
                  {upgrading === plan.id ? '⏳...' : plan.id === 'FREE' ? 'الخطة المجانية' : 'ترقية الآن'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}
