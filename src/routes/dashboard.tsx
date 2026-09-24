import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PetCard } from '@/components/PetCard'
import { QRCodeModal } from '@/components/QRCodeModal'
import type { Pet } from '@/lib/types'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { isAuthenticated, isLoading, profile, user } = useAuth()
  const navigate = useNavigate()
  const [pets, setPets] = useState<Pet[]>([])
  const [petsLoading, setPetsLoading] = useState(true)
  const [qrPet, setQrPet] = useState<Pet | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Pet | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: '/login' })
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated && user) loadPets()
  }, [isAuthenticated, user])

  const loadPets = async () => {
    setPetsLoading(true)
    const { data } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false })
    setPets(data ?? [])
    setPetsLoading(false)
  }

  const handleDelete = async (pet: Pet) => {
    setDeleting(true)
    await supabase.from('pets').delete().eq('id', pet.id)
    if (pet.photo_url) {
      const path = pet.photo_url.split('/pet-photos/')[1]
      if (path) await supabase.storage.from('pet-photos').remove([path])
    }
    setDeleteConfirm(null)
    setDeleting(false)
    loadPets()
  }

  const lostCount = pets.filter(p => p.is_lost).length
  const displayName = profile?.name?.split(' ')[0] || 'Tutor'

  if (isLoading) {
    return (
      <DashboardLayout title="Visão Geral">
        <div className="page-loading"><span className="spinner spinner-brand spinner-lg" /></div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Visão Geral">
      {/* Welcome */}
      <div className="dash-welcome animate-fade-up" style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--s2)' }}>Olá, {displayName}</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1.125rem' }}>
          {pets.length > 0
            ? 'Seus pets estão protegidos.'
            : 'Vamos proteger seu primeiro pet?'}
        </p>
      </div>
      {profile && !profile.whatsapp && pets.length > 0 && (
        <div className="alert alert-warning mb-5 animate-fade-up animate-delay-1" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>💬 Configure seu WhatsApp para que pessoas possam entrar em contato ao encontrar seu pet.</span>
          <Link to="/perfil" className="btn btn-primary btn-sm" style={{ flexShrink: 0, marginTop: 4 }}>
            Configurar agora
          </Link>
        </div>
      )}

      {/* Pets section */}
      <div className="animate-fade-up animate-delay-2">
        {petsLoading ? (
          <div className="page-loading" style={{ minHeight: 200 }}>
            <span className="spinner spinner-brand spinner-lg" />
          </div>
        ) : pets.length === 0 ? (
          /* Onboarding empty state */
          <div className="empty-state">
            <div className="empty-illustration">🐾</div>
            <h2>Vamos proteger seu primeiro pet?</h2>
            <p>Cadastre seu pet e gere o primeiro QR Code. Em menos de 5 minutos, seu animal terá uma identidade digital completa.</p>
            <Link to="/pets/novo" className="btn btn-primary btn-xl">
              + Adicionar meu pet
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s6)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Seus companheiros</h2>
              <Link to="/pets/novo" className="btn btn-brand-outline btn-sm" style={{ padding: '0 var(--s4)' }}>
                Adicionar pet
              </Link>
            </div>

            <div className="pets-grid">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onQRCode={setQrPet}
                  onDelete={setDeleteConfirm}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* QR Code Modal */}
      {qrPet && <QRCodeModal pet={qrPet} onClose={() => setQrPet(null)} />}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null) }}>
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>
                Excluir {deleteConfirm.name}?
              </h3>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Esta ação é permanente. O perfil público e o QR Code serão desativados.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)} disabled={deleting}>
                {deleting ? <><span className="spinner" />Excluindo...</> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
