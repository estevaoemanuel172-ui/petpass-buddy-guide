import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/DashboardLayout'

export const Route = createFileRoute('/perfil')({
  component: PerfilPage,
})

function PerfilPage() {
  const { isAuthenticated, isLoading, user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Formata o número (XX) 9XXXX-XXXX
  const formatWhatsapp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  // Prepara o valor para salvar no banco (55 + apenas digitos)
  const getRawNumber = (formatted: string) => {
    const digits = formatted.replace(/\D/g, '')
    if (digits.length === 10 || digits.length === 11) return `55${digits}`
    return ''
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: '/login' })
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      // Remove o '55' inicial se existir, para formatar para o input
      let phone = profile.whatsapp || ''
      if (phone.startsWith('55') && phone.length >= 12) {
        phone = phone.slice(2)
      }
      setWhatsapp(formatWhatsapp(phone))
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!name.trim()) { setError('O nome é obrigatório.'); return }

    const rawWhatsapp = getRawNumber(whatsapp)
    if (whatsapp.trim() && !rawWhatsapp) {
      setError('Digite um número de WhatsApp válido, com DDD.')
      return
    }

    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim(), whatsapp: rawWhatsapp || null })
      .eq('user_id', user!.id)

    if (error) {
      setError('Erro ao salvar. Tente novamente.')
    } else {
      setSuccess(true)
      await refreshProfile()
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  if (isLoading) return null

  return (
    <DashboardLayout title="Configurações">
      <div className="form-page">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-page-title">Meu perfil</h1>
              <p className="form-page-subtitle">
                Configure seu nome e WhatsApp para que pessoas possam entrar em contato
                quando encontrarem seu pet.
              </p>
            </div>

            <div className="form-card">
              {success && <div className="alert alert-success mb-6">✅ Perfil salvo com sucesso!</div>}
              {error && <div className="alert alert-danger mb-6">{error}</div>}

              <form className="form-section" onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Nome</label>
                  <input
                    id="name" type="text" className="form-input"
                    placeholder="Seu nome completo"
                    value={name} onChange={(e) => setName(e.target.value)} required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">E-mail</label>
                  <input
                    id="email" type="email" className="form-input"
                    value={user?.email ?? ''} disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p className="form-hint">O e-mail não pode ser alterado.</p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp" type="tel" className="form-input"
                    placeholder="(11) 99999-9999"
                    value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                  />
                  <p className="form-hint">
                    Informe seu DDD e o número. Não é necessário incluir o código do país (55).
                    Este número será usado para contato quando alguém escanear o QR Code do seu pet.
                  </p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner" />Salvando...</> : 'Salvar perfil'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
