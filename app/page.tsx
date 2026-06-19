import Link from 'next/link'

const FEATURES = [
  { icon: '🎵', title: 'توليد الأغاني بالذكاء الاصطناعي', desc: 'أنشئ أغاني كاملة بالعربية والإنجليزية بضغطة زر واحدة' },
  { icon: '🔐', title: 'مصادقة آمنة', desc: 'تسجيل دخول بالبريد الإلكتروني أو Google مع JWT وRefresh Tokens' },
  { icon: '💎', title: 'نظام Credits متكامل', desc: 'تتبع استهلاكك وشراء Credits جديدة عبر Stripe' },
  { icon: '📊', title: 'Dashboard متقدم', desc: 'لوحة تحكم احترافية بإحصائيات وتحليلات دقيقة' },
  { icon: '🏢', title: 'Multi-Tenant', desc: 'دعم المؤسسات والفرق مع أدوار وصلاحيات متعددة' },
  { icon: '🛡️', title: 'أمان على مستوى المؤسسات', desc: 'RBAC، Audit Logs، Rate Limiting، وحماية كاملة' },
]

export default function Home() {
  return (
    <main className="landing">
      <nav className="nav">
        <div className="brand">🎵 Melody AI</div>
        <div className="nav-links">
          <Link href="/status">Status</Link>
          <Link href="/login" className="btn outline sm">دخول</Link>
          <Link href="/register" className="btn sm">ابدأ مجاناً</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">✨ Enterprise AI SaaS Platform</div>
        <h1>منصة توليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي</h1>
        <p>
          أنشئ أغاني احترافية بالعربية والإنجليزية في ثوانٍ. منصة SaaS متكاملة 
          مع نظام Credits، اشتراكات Stripe، ولوحة تحكم عالمية.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn">🚀 ابدأ مجاناً — 100 Credit</Link>
          <Link href="/login" className="btn outline">تسجيل الدخول</Link>
        </div>
      </section>

      <div className="features-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="card hover">
            <div className="card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p className="muted text-sm" style={{lineHeight:1.6}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
