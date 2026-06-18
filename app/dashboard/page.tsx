import { AppShell } from "@/components/AppShell"

export default function DashboardPage() {
  return (
    <AppShell>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="card"><h3>Credits</h3><p>5,000</p></div>
        <div className="card"><h3>AI Generations</h3><p>128</p></div>
        <div className="card"><h3>Plan</h3><p>PRO</p></div>
      </div>
    </AppShell>
  )
}
