
export default function AI() {
  return (
    <div style={{ padding:40 }}>
      <h2>🤖 AI Studio</h2>

      <div style={{
        background:'#0B1023',
        padding:20,
        borderRadius:16,
        marginTop:20
      }}>
        <textarea
          placeholder="Describe your idea..."
          style={{
            width:'100%',
            height:120,
            background:'transparent',
            color:'white',
            border:'none',
            outline:'none'
          }}
        />
        <button style={{
          marginTop:10,
          padding:10,
          background:'#4F46E5',
          border:'none',
          borderRadius:10,
          color:'white'
        }}>
          Generate
        </button>
      </div>
    </div>
  )
}
