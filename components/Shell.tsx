'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearSession, getStoredUser } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { ApiUser } from '@/lib/api'

const NAV = [
  { href: '/dashboard', icon: '⚡', label: 'Dashboard' },
  { href: '/studio',    icon: '🎵', label: 'AI Studio' },
  { href: '/projects',  icon: '📁', label: 'المشاريع' },
  { href: '/credits',   icon: '💎', label: 'Credits' },
  { href: '/billing',   icon: '💳', label: 'Billing' },
  { href: '/settings',  icon: '⚙️', label: 'الإعدادات' },
]

const ADMIN_NAV = [
  { href: '/admin', icon: '🛡️', label: 'Admin Panel' },
  { href: '/status', icon: '🔍', label: 'System Status' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const pathname = usePathname()

  useEffect(() => { setUser(getStoredUser()) }, [])

  const logout = () => { clearSession(); window.location.href = '/login' }
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">Melody AI</div>
        <nav>
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`nav-item${pathname === item.href ? ' active' : ''}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <div style={{height:1,background:'rgba(255,255,255,.07)',margin:'10px 6px'}} />
              {ADMIN_NAV.map(item => (
                <Link key={item.href} href={item.href}
                  className={`nav-item${pathname === item.href ? ' active' : ''}`}>
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <div className="user-meta">
              <div className="user-name">{user?.name || user?.email}</div>
              <div className="user-tier">{user?.tier || 'FREE'} · {user?.credits ?? 0} credits</div>
            </div>
          </div>
          <button className="btn ghost full mt-4" onClick={logout} style={{fontSize:13}}>
            تسجيل خروج
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="topbar-title">
            {NAV.find(n => n.href === pathname)?.label ||
             ADMIN_NAV.find(n => n.href === pathname)?.label || 'Melody AI'}
          </span>
          <div className="topbar-actions">
            <span className="pill indigo">💎 {user?.credits ?? 0}</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
