import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/cadastro')({
  component: CadastroPage,
})

function CadastroPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate({ to: '/dashboard' })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // User is logged in directly (email confirmation disabled)
      navigate({ to: '/dashboard' })
    } else {
      // User needs to confirm email (session is null)
      setSuccess('Conta criada com sucesso! Verifique seu e-mail para confirmar seu cadastro.')
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

        <h1 className="auth-title">Crie sua conta</h1>
        <p className="auth-subtitle">Grátis para sempre. Sem cartão de crédito.</p>

        {error && <div className="alert alert-danger mb-6">{error}</div>}
        {success && <div className="alert alert-success mb-6">{success}</div>}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <><span className="spinner" />Criando conta...</> : '🐾 Criar conta grátis'}
          </button>
        </form>
        )}

        <div className="auth-footer">
          Já tem conta?{' '}
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
