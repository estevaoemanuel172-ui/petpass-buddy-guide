import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PetForm } from '@/components/PetForm'

export const Route = createFileRoute('/pets/novo')({
  component: NovoPetPage,
})

function NovoPetPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: '/login' })
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) return null

  return (
    <DashboardLayout title="Novo Pet">
      <div className="form-page">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-page-title">Novo pet 🐾</h1>
              <p className="form-page-subtitle">
                Preencha as informações do seu pet para criar o perfil digital e o QR Code.
              </p>
            </div>

            <div className="form-card">
              <PetForm
                onSuccess={() => navigate({ to: '/dashboard' })}
                onCancel={() => navigate({ to: '/dashboard' })}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
