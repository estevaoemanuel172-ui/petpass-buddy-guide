import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'

interface NavItem {
  to: string
  label: string
  icon: string
}

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Visão Geral', icon: '⊞' },
  { to: '/pets/novo', label: 'Adicionar Pet', icon: '+' },
]

export function DashboardLayout({ children, title = 'Dashboard' }: { children: ReactNode; title?: string }) {
  const { profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [drawerOpen, setDrawerOpen] = useState(false)

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Tutor'
  const initials = displayName.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        <Link to="/" className="logo-mark" onClick={() => setDrawerOpen(false)}>
          <div className="logo-icon">🐾</div>
          PetPass
        </Link>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Principal</div>

        <Link
          to="/dashboard"
          className={`sidebar-link ${currentPath === '/dashboard' ? 'active' : ''}`}
          onClick={() => setDrawerOpen(false)}
        >
          <span className="sidebar-icon">⊞</span>
          Visão Geral
        </Link>

        <Link
          to="/pets/novo"
          className={`sidebar-link ${currentPath === '/pets/novo' ? 'active' : ''}`}
          onClick={() => setDrawerOpen(false)}
        >
          <span className="sidebar-icon">＋</span>
          Adicionar Pet
        </Link>

        <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Conta</div>

        <Link
          to="/perfil"
          className={`sidebar-link ${currentPath === '/perfil' ? 'active' : ''}`}
          onClick={() => setDrawerOpen(false)}
        >
          <span className="sidebar-icon">⚙</span>
          Configurações
        </Link>

        <button className="sidebar-link" onClick={handleSignOut} style={{ marginTop: '4px' }}>
          <span className="sidebar-icon">↗</span>
          Sair da conta
        </button>
      </nav>

      <div className="sidebar-footer">
        <Link to="/perfil" className="sidebar-user" style={{ textDecoration: 'none' }} onClick={() => setDrawerOpen(false)}>
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name truncate">{displayName}</div>
            <div className="sidebar-user-role">Tutor PetPass</div>
          </div>
        </Link>
      </div>
    </>
  )

  return (
    <div className="app-shell">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <Link to="/" className="logo-mark" style={{ fontSize: '1.125rem', width: '100%', justifyContent: 'center' }}>
          <div className="logo-icon" style={{ width: 26, height: 26, fontSize: '0.85rem' }}>🐾</div>
          PetPass
        </Link>
      </header>

      {/* Main area */}
      <div className="main-area">
        {/* Desktop topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <Link to="/pets/novo" className="btn btn-primary btn-sm">
              + Adicionar pet
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="page-body">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link to="/dashboard" className={`bottom-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
          <span className="bottom-nav-icon">🏠</span>
          <span>Início</span>
        </Link>
        <Link to="/dashboard" className={`bottom-nav-item ${currentPath === '/dashboard' && false ? 'active' : ''}`}>
          <span className="bottom-nav-icon">🐾</span>
          <span>Pets</span>
        </Link>
        <Link to="/pets/novo" className={`bottom-nav-item ${currentPath === '/pets/novo' ? 'active' : ''}`}>
          <span className="bottom-nav-icon">➕</span>
          <span>Adicionar</span>
        </Link>
        <Link to="/perfil" className={`bottom-nav-item ${currentPath === '/perfil' ? 'active' : ''}`}>
          <span className="bottom-nav-icon">⚙️</span>
          <span>Conta</span>
        </Link>
      </nav>
    </div>
  )
}
