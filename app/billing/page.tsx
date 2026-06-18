import { AppShell } from "@/components/AppShell"

export default function BillingPage() {
  return (
    <AppShell>
      <h1>Billing</h1>
      <div className="plans">
        <div className="card"><h3>Free</h3><p>100 Credits</p><button className="btn secondary">Current</button></div>
        <div className="card"><h3>Pro</h3><p>5,000 Credits</p><button className="btn">Upgrade</button></div>
        <div className="card"><h3>Enterprise</h3><p>Unlimited</p><button className="btn secondary">Contact</button></div>
      </div>
    </AppShell>
  )
}
