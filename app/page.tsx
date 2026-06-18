
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div style={{ padding:60 }}>
      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        🚀 Ultra SaaS Platform
      </motion.h1>
      <p style={{opacity:0.7}}>Stripe-level AI SaaS Dashboard</p>
    </div>
  )
}
