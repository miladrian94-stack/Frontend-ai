const BASE = process.env.NEXT_PUBLIC_API_URL || "https://melody-ai-7sn4.onrender.com"

export const api = {
  async get(path: string) {
    const res = await fetch(BASE + path)
    return res.json()
  },
  async post(path: string, body: unknown) {
    const res = await fetch(BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.json()
  },
}
