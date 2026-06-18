import Link from "next/link"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h2>Melody AI</h2>
        <div className="menu">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/ai">AI Studio</Link>
          <Link href="/billing">Billing</Link>
          <Link href="/">Landing</Link>
        </div>
      </aside>
      <section className="content">
        <div className="topbar">
          <strong>Enterprise Workspace</strong>
          <span>Credits: 5,000</span>
        </div>
        {children}
      </section>
    </main>
  )
}
