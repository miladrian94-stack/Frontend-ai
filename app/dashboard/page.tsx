
export default function Dashboard() {
  return (
    <div style={{ padding:40 }}>
      <h2>📊 Dashboard</h2>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:20,
        marginTop:20
      }}>
        <Card title="Credits" />
        <Card title="AI Usage" />
        <Card title="Revenue" />
      </div>
    </div>
  )
}

function Card({title}) {
  return (
    <div style={{
      background:'#0B1023',
      padding:20,
      borderRadius:16,
      border:'1px solid rgba(255,255,255,0.05)'
    }}>
      {title}
    </div>
  )
}
