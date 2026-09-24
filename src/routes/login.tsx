import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate({ to: '/dashboard' })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : error.message)
    } else {
      navigate({ to: '/dashboard' })
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span style={{ fontSize: '2rem' }}>🐾</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem' }}>
            PetPass
          </span>
        </Link>

        <h1 className="auth-title">Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre na sua conta para gerenciar seus pets.</p>

        {error && <div className="alert alert-danger mb-6">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <Link to="/recuperar-senha" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 500 }}>
              Esqueci minha senha
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <><span className="spinner" />Entrando...</> : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          Ainda não tem conta?{' '}
          <Link to="/cadastro">Cadastre-se grátis</Link>
        </div>
      </div>
    </div>
  )
}
