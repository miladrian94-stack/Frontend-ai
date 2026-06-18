import Link from "next/link"

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand">Melody AI</div>
        <div className="links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/ai">AI Studio</Link>
          <Link href="/billing">Billing</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">Enterprise AI SaaS Platform</div>
        <h1>منصة ذكاء اصطناعي لتوليد الأغاني والمحتوى</h1>
        <p>
          واجهة SaaS احترافية مربوطة لاحقًا مع Backend على Render، وتدعم AI Studio وCredits وBilling.
        </p>
        <Link className="btn" href="/dashboard">افتح لوحة التحكم</Link>
        <Link className="btn secondary" href="/ai">جرب AI Studio</Link>
      </section>

      <section className="grid">
        <div className="card"><h3>AI Studio</h3><p>واجهة توليد قابلة للربط مع محرك الذكاء الاصطناعي.</p></div>
        <div className="card"><h3>Credits</h3><p>نظام رصيد واستهلاك مناسب لمنصات SaaS.</p></div>
        <div className="card"><h3>Billing</h3><p>جاهز لربط الاشتراكات والمدفوعات.</p></div>
      </section>
    </main>
  )
}
