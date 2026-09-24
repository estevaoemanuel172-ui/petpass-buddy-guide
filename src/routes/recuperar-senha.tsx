import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/recuperar-senha')({
  component: RecuperarSenhaPage,
})

function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
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

        <h1 className="auth-title">Recuperar senha</h1>
        <p className="auth-subtitle">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {sent ? (
          <div>
            <div className="alert alert-success mb-6">
              ✉️ E-mail enviado! Verifique sua caixa de entrada e clique no link de recuperação.
            </div>
            <div className="auth-footer">
              <Link to="/login">← Voltar para o login</Link>
            </div>
          </div>
        ) : (
          <>
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
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <><span className="spinner" />Enviando...</> : 'Enviar link de recuperação'}
              </button>
            </form>
            <div className="auth-footer">
              <Link to="/login">← Voltar para o login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
