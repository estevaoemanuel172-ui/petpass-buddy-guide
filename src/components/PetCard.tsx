import { Link } from '@tanstack/react-router'
import type { Pet } from '@/lib/types'

interface PetCardProps {
  pet: Pet
  onQRCode: (pet: Pet) => void
  onDelete: (pet: Pet) => void
}

export function PetCard({ pet, onQRCode, onDelete }: PetCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Photo header */}
      <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: 'var(--brand-light)' }}>
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🐾</div>
        )}
        {/* Status badge floating */}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          {pet.is_lost ? (
            <span className="badge badge-red" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>🚨 Perdido</span>
          ) : (
            <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>🟢 Protegido</span>
          )}
        </div>
      </div>
      
      {/* Body */}
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>{pet.name}</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink-3)', marginTop: 2 }}>
            {pet.breed || pet.species || 'Sem raça definida'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
          <Link to="/pet/$id" params={{ id: pet.id }} className="btn btn-primary btn-sm">
            Ver Perfil
          </Link>
          <button className="btn btn-secondary btn-sm" onClick={() => onQRCode(pet)}>
            QR Code
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <Link to="/pets/$id/editar" params={{ id: pet.id }} className="btn btn-ghost btn-xs" style={{ color: 'var(--ink-3)' }}>
            Editar perfil
          </Link>
          <button className="btn btn-ghost btn-xs text-danger" onClick={() => onDelete(pet)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
