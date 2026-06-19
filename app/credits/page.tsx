'use client'
import { Shell } from '@/components/Shell'
import { apiGet, apiPost, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { CreditLedgerEntry, ApiUser } from '@/lib/api'

const CREDIT_PACKS = [
  { id: 'pack_500',  credits: 500,   price: '$4.99',   label: 'Starter Pack' },
  { id: 'pack_2000', credits: 2000,  price: '$14.99',  label: 'Pro Pack',    popular: true },
  { id: 'pack_5000', credits: 5000,  price: '$29.99',  label: 'Power Pack' },
]

export default function CreditsPage() {
  const [user, setUser] = useState<ApiUser | null>(getStoredUser())
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!getStoredUser()) { window.location.href = '/login'; return }
    Promise.allSettled([
      apiGet<ApiUser>('/api/me'),
      apiGet<{ entries: CreditLedgerEntry[] }>('/api/credits/ledger'),
    ]).then(([u, l]) => {
      if (u.status === 'fulfilled') setUser(u.value)
      if (l.status === 'fulfilled') setLedger(l.value?.entries || [])
    }).finally(() => setLoading(false))
  }, [])

  async function purchasePack(packId: string) {
    setPurchasing(packId)
    setError('')
    setSuccess('')
    try {
      const data = await apiPost<{ url?: string; message?: string }>('/api/payments/checkout', { packId })
      if (data?.url) window.location.href = data.url
      else setSuccess(data?.message || 'تم شراء Credits بنجاح!')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'فشل عملية الشراء')
    } finally {
      setPurchasing(null)
    }
  }

  const tierCredits: Record<string, number> = { FREE: 100, STARTER: 1000, PRO: 5000, ENTERPRISE: -1 }
  const maxCredits = tierCredits[user?.tier || 'FREE'] || 100
  const percentage = maxCredits === -1 ? 100 : Math.min(100, ((user?.credits || 0) / maxCredits) * 100)

  return (
    <Shell>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Balance Card */}
      <div className="card" style={{marginBottom:24}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="stat-label">💎 الرصيد الحالي</div>
            <div style={{fontSize:40,fontWeight:900,color:'#a5b4fc'}}>
              {loading ? '...' : user?.credits ?? 0}
              <span style={{fontSize:16,color:'#64748b',fontWeight:400}}> credits</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <span className="pill indigo">{user?.tier || 'FREE'}</span>
            <div className="muted text-sm mt-4">{user?.totalSongsGenerated || 0} أغنية مولَّدة</div>
          </div>
        </div>
        {maxCredits !== -1 && (
          <>
            <div className="progress-bar">
              <div className="progress-fill" style={{width:`${percentage}%`}} />
            </div>
            <div className="flex justify-between mt-4 muted text-sm">
              <span>{user?.credits} / {maxCredits}</span>
              <span>{Math.round(percentage)}% متبقٍ</span>
            </div>
          </>
        )}
      </div>

      {/* Buy Packs */}
      <h2 style={{margin:'0 0 16px',fontSize:18}}>شراء Credits إضافية</h2>
      <div className="plans-grid" style={{marginBottom:32}}>
        {CREDIT_PACKS.map(pack => (
          <div key={pack.id} className={`plan-card${pack.popular?' popular':''}`}>
            {pack.popular && <div className="plan-popular-badge">⭐ الأكثر شيوعاً</div>}
            <div className="plan-name">{pack.label}</div>
            <div className="plan-price">{pack.price}</div>
            <p className="plan-desc">💎 {pack.credits.toLocaleString()} Credits</p>
            <button className={`btn full${pack.popular?'':' outline'}`}
              onClick={() => purchasePack(pack.id)}
              disabled={purchasing === pack.id}>
              {purchasing === pack.id ? '⏳...' : 'شراء الآن'}
            </button>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <h2 style={{margin:'0 0 16px',fontSize:18}}>سجل المعاملات</h2>
      {loading ? (
        <div className="card"><div className="skeleton" style={{height:200}} /></div>
      ) : ledger.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📊</div><h3>لا توجد معاملات بعد</h3></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>الرصيد بعد</th>
                <th>السبب</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map(entry => (
                <tr key={entry.id}>
                  <td>
                    <span className={`pill ${entry.type === 'GRANT' || entry.type === 'PURCHASE' ? 'green' : entry.type === 'USAGE' ? 'red' : 'gray'}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td style={{fontWeight:700,color:entry.amount > 0 ? '#6ee7b7' : '#fca5a5'}}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </td>
                  <td>{entry.balanceAfter}</td>
                  <td className="muted">{entry.reason}</td>
                  <td className="muted">{new Date(entry.createdAt).toLocaleDateString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  )
}
