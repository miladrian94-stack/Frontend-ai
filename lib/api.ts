
const BASE = "http://localhost:3001"

export const api = {
  get: async (url) => {
    const r = await fetch(BASE + url)
    return r.json()
  },
  post: async (url, body) => {
    const r = await fetch(BASE + url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })
    return r.json()
  }
}
