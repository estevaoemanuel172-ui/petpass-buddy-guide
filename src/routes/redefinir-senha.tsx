import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/redefinir-senha')({
  component: RedefinirSenhaPage,
})

function RedefinirSenhaPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Listen for the recovery event which is fired when the user clicks the email link
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setReady(true)
        } else if (!session) {
          setError('Link inválido ou expirado. Solicite um novo link de recuperação.')
        } else {
          // If they just happen to have a session already, let them reset
          setReady(true)
        }
      }
    )

    // Fallback: check if session already exists on mount just in case
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate({ to: '/login' }), 2500)
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

        <h1 className="auth-title">Nova senha</h1>
        <p className="auth-subtitle">Escolha uma nova senha para sua conta.</p>

        {success ? (
          <div className="alert alert-success">
            ✅ Senha alterada com sucesso! Redirecionando para o login...
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger mb-6">{error}</div>}
            {ready && (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Nova senha</label>
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
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm">Confirmar nova senha</label>
                  <input
                    id="confirm"
                    type="password"
                    className="form-input"
                    placeholder="Repita a senha"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? <><span className="spinner" />Salvando...</> : 'Salvar nova senha'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
