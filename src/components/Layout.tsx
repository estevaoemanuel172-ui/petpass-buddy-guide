import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
import type { ReactNode } from 'react'

export function PublicLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header className="public-header">
        <div className="container">
          <div className="public-header-inner">
            <Link to="/" className="logo-mark">
              <div className="logo-icon">🐾</div>
              PetPass
            </Link>

            <nav className="public-nav">
              <a href="#como-funciona" className="public-nav-link">Como funciona</a>
              <a href="#seguranca" className="public-nav-link">Segurança</a>
              <a href="#beneficios" className="public-nav-link">Recursos</a>
            </nav>

            <div className="public-header-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Entrar
                  </Link>
                  <Link to="/cadastro" className="btn btn-primary btn-sm">
                    Criar meu PetPass
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo-mark" style={{ color: '#fff', marginBottom: '12px' }}>
                <div className="logo-icon">🐾</div>
                PetPass
              </div>
              <p>Seu pet não fala.<br />O PetPass fala por ele.</p>
            </div>
            <div>
              <div className="footer-col-title">Produto</div>
              <a href="#como-funciona" className="footer-link">Como funciona</a>
              <a href="#beneficios" className="footer-link">Recursos</a>
              <a href="#seguranca" className="footer-link">Segurança</a>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <a href="#" className="footer-link">Privacidade</a>
              <a href="#" className="footer-link">Termos de uso</a>
            </div>
            <div>
              <div className="footer-col-title">Conta</div>
              <Link to="/login" className="footer-link">Entrar</Link>
              <Link to="/cadastro" className="footer-link">Criar conta</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} PetPass. Todos os direitos reservados.</span>
            <span>Feito com ❤️ para proteger seus pets</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
