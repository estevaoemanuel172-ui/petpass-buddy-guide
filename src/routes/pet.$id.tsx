import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Pet, Profile } from '@/lib/types'
import { QRCodeSVG } from 'qrcode.react'

export const Route = createFileRoute('/pet/$id')({
  component: PublicPetProfile,
})

function PublicPetProfile() {
  const { id } = Route.useParams()
  const [pet, setPet] = useState<Pet | null>(null)
  const [owner, setOwner] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      // 1. Load public pet info
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single()

      if (petError || !petData) {
        setError('Pet não encontrado.')
        setLoading(false)
        return
      }

      setPet(petData)

      // 2. Load owner profile using the secure RPC
      const { data: ownerData } = await supabase
        .rpc('get_owner_profile', { pet_id_param: id })
        .single()

      if (ownerData) {
        setOwner(ownerData)
      }

      setLoading(false)
    }

    loadData()
  }, [id])

  if (loading) return <div className="page-loading"><span className="spinner spinner-brand spinner-lg" /></div>

  if (error || !pet) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '100vh', background: 'var(--surface)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 24 }}>😕</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>Não encontramos este pet.</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1.0625rem', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Este QR Code pode estar desativado ou o perfil não está mais disponível.
        </p>
        <Link to="/" className="btn btn-primary btn-xl">
          Voltar para o PetPass
        </Link>
      </div>
    )
  }

  const ownerFirstName = owner?.name?.split(' ')[0] || 'O tutor'
  
  // Format whatsapp to guarantee it works as a link
  let whatsappLink = ''
  if (owner?.whatsapp) {
    // Ensure only digits are used for the link
    const cleanNumber = owner.whatsapp.replace(/\D/g, '')
    const msg = encodeURIComponent(`Olá! Encontrei o(a) ${pet.name}.`)
    whatsappLink = `https://wa.me/${cleanNumber}?text=${msg}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      
      {/* Branding bar */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 28, height: 28, background: 'var(--brand)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem' }}>🐾</div>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>PetPass</span>
      </div>

      {/* Photo Area */}
      <div style={{ width: '100%', height: '50vh', maxHeight: 420, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '5rem', color: 'var(--ink-4)' }}>🐾</div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(transparent, var(--bg))' }} />
      </div>

      <div style={{ padding: '0 20px', marginTop: '-48px', position: 'relative', zIndex: 10, maxWidth: 520, margin: '-48px auto 0' }}>
        
        {/* Name and Basic Info */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 2.5rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {pet.name}
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--ink-3)', fontWeight: 500, marginBottom: 12 }}>
            {pet.breed || pet.species || 'Sem raça definida'}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: pet.is_lost ? 'var(--danger-light)' : 'var(--success-light)', color: pet.is_lost ? 'var(--danger)' : 'var(--success)', borderRadius: 'var(--r-full)', fontSize: '0.8125rem', fontWeight: 600 }}>
            {pet.is_lost ? '🚨 Pet Perdido' : '🟢 Protegido pelo PetPass'}
          </div>
        </div>

        {/* LOST BANNER */}
        {pet.is_lost && (
          <div className="animate-fade-up" style={{ background: 'var(--danger)', color: '#fff', padding: '24px', borderRadius: 'var(--r-xl)', textAlign: 'center', marginBottom: '32px', boxShadow: '0 12px 32px rgba(220,38,38,0.3)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚨</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>ESTE PET ESTÁ PERDIDO</h2>
            <p style={{ fontSize: '0.9375rem', opacity: 0.9 }}>
              A família de {pet.name} está procurando por ele. Se você o encontrou, por favor entre em contato urgentemente.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="animate-fade-up animate-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {whatsappLink ? (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-xl btn-block" style={{ fontSize: '1.0625rem', fontWeight: 600 }}>
              💬 Falar com {ownerFirstName}
            </a>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--r-lg)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.9375rem' }}>
                O tutor ainda não configurou um contato direto.
              </p>
            </div>
          )}

          <button className="btn btn-secondary btn-lg btn-block" style={{ fontSize: '1rem' }}>
            📍 Avisar onde encontrei
          </button>
        </div>

        {/* Important Info Section */}
        <div className="animate-fade-up animate-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pet.important_information && (
            <div className="card" style={{ padding: '20px', background: 'var(--danger-light)', borderColor: 'var(--danger-mid)' }}>
              <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--danger)', fontWeight: 700, marginBottom: 8 }}>⚠️ Atenção</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{pet.important_information}</p>
            </div>
          )}

          {pet.characteristics && (
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', fontWeight: 700, marginBottom: 8 }}>Características</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{pet.characteristics}</p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--ink-4)', fontSize: '0.8125rem' }}>
          Perfil protegido por <strong style={{ color: 'var(--brand)' }}>PetPass</strong>
        </div>

      </div>
    </div>
  )
}
