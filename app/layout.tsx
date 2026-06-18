
export default function Layout({ children }) {
  return (
    <html>
      <body style={{
        margin:0,
        fontFamily:'Inter',
        background:'#050816',
        color:'white'
      }}>
        {children}
      </body>
    </html>
  )
}
