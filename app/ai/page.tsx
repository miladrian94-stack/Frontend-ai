import { AppShell } from "@/components/AppShell"

export default function AIStudioPage() {
  return (
    <AppShell>
      <h1>AI Studio</h1>
      <div className="composer">
        <textarea placeholder="اكتب فكرة الأغنية أو المحتوى هنا..." />
        <div className="row">
          <span>Cost: 10 credits</span>
          <button className="btn">Generate</button>
        </div>
      </div>
      <div className="card" style={{marginTop:18}}>
        <h3>Generation Result</h3>
        <p>سيظهر الناتج هنا بعد الربط الكامل مع API.</p>
      </div>
    </AppShell>
  )
}
