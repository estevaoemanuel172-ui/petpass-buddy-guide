import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PetForm } from '@/components/PetForm'
import type { Pet } from '@/lib/types'

export const Route = createFileRoute('/pets/$id/editar')({
  component: EditarPetPage,
})

function EditarPetPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: '/login' })
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!user) return
    supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setError('Pet não encontrado ou sem permissão.')
        else setPet(data)
        setLoading(false)
      })
  }, [id, user])

  if (isLoading || loading) {
    return (
      <DashboardLayout title="Editar Pet">
        <div className="page-loader"><span className="spinner spinner-dark" /></div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Editar Pet">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
          <h2>{error}</h2>
          <button className="btn btn-primary mt-6" onClick={() => navigate({ to: '/dashboard' })}>
            Voltar ao dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Editar Pet">
      <div className="form-page">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-page-title">Editar {pet?.name} ✏️</h1>
              <p className="form-page-subtitle">
                Atualize as informações do pet. Lembre-se de ativar o status "perdido" caso necessário.
              </p>
            </div>

            <div className="form-card">
              {pet && (
                <PetForm
                  petId={id}
                  initialData={pet}
                  onSuccess={() => navigate({ to: '/dashboard' })}
                  onCancel={() => navigate({ to: '/dashboard' })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
