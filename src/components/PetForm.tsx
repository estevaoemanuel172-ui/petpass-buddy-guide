import { useState, useRef, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { PetFormData } from '@/lib/types'
import { Link } from '@tanstack/react-router'

interface PetFormProps {
  initialData?: Partial<PetFormData>
  petId?: string
  onSuccess: () => void
  onCancel: () => void
}

const SPECIES_OPTIONS = [
  { value: 'cachorro', label: 'Cachorro', icon: '🐶' },
  { value: 'gato', label: 'Gato', icon: '🐱' },
  { value: 'outro', label: 'Outro', icon: '🐾' }
]

export function PetForm({ initialData, petId, onSuccess, onCancel }: PetFormProps) {
  const { user } = useAuth()
  
  // Steps: 1: Name & Species, 2: Photo & Basic Info, 3: Characteristics, 4: Success (only for new pets)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<PetFormData>({
    name: initialData?.name ?? '',
    species: initialData?.species ?? '',
    breed: initialData?.breed ?? '',
    sex: initialData?.sex ?? null,
    birth_date: initialData?.birth_date ?? null,
    color: initialData?.color ?? '',
    characteristics: initialData?.characteristics ?? '',
    important_information: initialData?.important_information ?? '',
    photo_url: initialData?.photo_url ?? null,
    is_lost: initialData?.is_lost ?? false,
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo_url ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof PetFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('A foto deve ter no máximo 5MB.')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setError('')
  }

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !user) return form.photo_url
    const ext = photoFile.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('pet-photos').upload(path, photoFile, {
      cacheControl: '3600', upsert: false
    })
    if (error) throw new Error('Erro ao fazer upload da foto: ' + error.message)
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(path)
    return data.publicUrl
  }

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim()) { setError('Como ele se chama?'); return }
      if (!form.species) { setError('O que ele é? (Cachorro, Gato...)'); return }
    }
    if (step === 2) {
      if (!photoPreview && !petId) { setError('Uma foto é essencial para o perfil do pet.'); return }
    }
    setError('')
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')

    setLoading(true)
    try {
      const photoUrl = await uploadPhoto()
      const payload = { ...form, photo_url: photoUrl }

      if (petId) {
        const { error } = await supabase.from('pets').update(payload).eq('id', petId)
        if (error) throw error
        onSuccess()
      } else {
        const { error } = await supabase.from('pets').insert({ ...payload, user_id: user!.id })
        if (error) throw error
        // Move to success step instead of immediate redirect
        setStep(4)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.')
    }
    setLoading(false)
  }

  // Common wrapper for wizard steps
  const renderStepHeader = (title: string, subtitle?: string) => (
    <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-slide-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {subtitle && <p style={{ color: 'var(--ink-3)', fontSize: '1rem' }}>{subtitle}</p>}
    </div>
  )

  const renderProgressBar = () => (
    <div className="wizard-progress animate-slide-in">
      {[1, 2, 3].map(n => (
        <div 
          key={n} 
          className={`wizard-step-dot ${step === n ? 'active' : ''} ${step > n ? 'completed' : ''}`} 
        />
      ))}
    </div>
  )

  // Step 1: Name and Species
  if (step === 1) {
    return (
      <div className="wizard-step">
        {renderProgressBar()}
        {renderStepHeader('Vamos cadastrar seu companheiro 🐾', 'Primeiro, conte um pouco sobre ele.')}

        <div className="animate-slide-in">
          {error && <div className="alert alert-danger mb-6">{error}</div>}
          
          <div className="form-group mb-8">
            <label className="form-label" style={{ fontSize: '1.125rem', textAlign: 'center', display: 'block' }}>
              Qual é o nome dele(a)?
            </label>
            <input
              type="text" 
              className="form-input" 
              style={{ fontSize: '1.25rem', height: '60px', textAlign: 'center', fontWeight: 600, borderRadius: 'var(--r-xl)' }}
              placeholder="Ex: Thor"
              value={form.name} 
              onChange={(e) => update('name', e.target.value)} 
              autoFocus
            />
          </div>

          <label className="form-label" style={{ fontSize: '1.125rem', textAlign: 'center', display: 'block', marginBottom: '16px' }}>
            Ele é...
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {SPECIES_OPTIONS.map(opt => (
              <div 
                key={opt.value}
                className={`wizard-option ${form.species === opt.value ? 'selected' : ''}`}
                onClick={() => update('species', opt.value)}
              >
                <div className="wizard-option-icon">{opt.icon}</div>
                <div className="wizard-option-label">{opt.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {petId && (
              <button type="button" className="btn btn-secondary btn-xl" style={{ flex: 1 }} onClick={onCancel}>
                Cancelar
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-primary btn-xl" 
              style={{ flex: 2 }} 
              onClick={handleNext}
            >
              Continuar →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Photo and Basic Info
  if (step === 2) {
    return (
      <div className="wizard-step">
        {renderProgressBar()}
        {renderStepHeader(`Como é o ${form.name || 'pet'}?`)}

        <div className="animate-slide-in">
          {error && <div className="alert alert-danger mb-6">{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div 
              style={{ 
                width: 140, height: 140, borderRadius: 'var(--r-2xl)', overflow: 'hidden', 
                background: 'var(--surface-2)', border: '2px dashed var(--brand-mid)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', marginBottom: '16px'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--brand)', fontWeight: 600 }}>Adicionar foto</div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>

          <div className="form-group mb-5">
            <label className="form-label">Qual a raça?</label>
            <input
              type="text" className="form-input" placeholder="Ex: Golden Retriever, SRD (Vira-lata)"
              value={form.breed ?? ''} onChange={(e) => update('breed', e.target.value)}
              style={{ height: '52px' }}
            />
          </div>

          <div className="form-group mb-5">
            <label className="form-label">Sexo</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div 
                className={`wizard-option ${form.sex === 'macho' ? 'selected' : ''}`}
                style={{ padding: '16px', flexDirection: 'row', gap: '8px' }}
                onClick={() => update('sex', 'macho')}
              >
                <div style={{ fontSize: '1.25rem' }}>♂️</div>
                <div style={{ fontWeight: 600 }}>Macho</div>
              </div>
              <div 
                className={`wizard-option ${form.sex === 'femea' ? 'selected' : ''}`}
                style={{ padding: '16px', flexDirection: 'row', gap: '8px' }}
                onClick={() => update('sex', 'femea')}
              >
                <div style={{ fontSize: '1.25rem' }}>♀️</div>
                <div style={{ fontWeight: 600 }}>Fêmea</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div className="form-group">
              <label className="form-label">Cor</label>
              <input
                type="text" className="form-input" placeholder="Ex: Dourado"
                value={form.color ?? ''} onChange={(e) => update('color', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nascimento (aprox.)</label>
              <input
                type="date" className="form-input"
                value={form.birth_date ?? ''} onChange={(e) => update('birth_date', e.target.value || null)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary btn-xl" style={{ flex: 1 }} onClick={handleBack}>
              ← Voltar
            </button>
            <button type="button" className="btn btn-primary btn-xl" style={{ flex: 2 }} onClick={handleNext}>
              Continuar →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Characteristics & Status
  if (step === 3) {
    return (
      <div className="wizard-step">
        {renderProgressBar()}
        {renderStepHeader('Tem algo importante que devemos saber?', 'Essas informações podem ajudar muito caso ele se perca.')}

        <div className="animate-slide-in">
          {error && <div className="alert alert-danger mb-6">{error}</div>}

          <div className="form-group mb-6">
            <label className="form-label" style={{ fontSize: '1rem' }}>Marcas ou características</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Ex: Mancha branca no peito, usa coleira azul, rabo curto..."
              value={form.characteristics ?? ''} onChange={(e) => update('characteristics', e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label" style={{ fontSize: '1rem' }}>Cuidados Especiais (Opcional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Ex: É alérgico a frango, toma remédio contínuo, é assustado com barulho..."
              value={form.important_information ?? ''} onChange={(e) => update('important_information', e.target.value)}
              style={{ minHeight: '120px' }}
            />
            <p className="form-hint" style={{ marginTop: '8px' }}>Você poderá editar essas informações a qualquer momento.</p>
          </div>

          {petId && (
            <div className="form-group mb-8">
              <label className="form-label">Status atual</label>
              <div
                className={`toggle-wrapper ${form.is_lost ? 'active' : ''}`}
                onClick={() => update('is_lost', !form.is_lost)}
                style={{ cursor: 'pointer', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: form.is_lost ? 'var(--danger-light)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ fontSize: '2rem' }}>{form.is_lost ? '🚨' : '✅'}</div>
                <div>
                  <div style={{ fontWeight: 700, color: form.is_lost ? 'var(--danger)' : 'var(--ink)', fontSize: '1.0625rem' }}>
                    {form.is_lost ? 'ESTE PET ESTÁ PERDIDO' : 'Pet seguro em casa'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--ink-3)' }}>
                    {form.is_lost ? 'O perfil exibirá um alerta vermelho de emergência.' : 'Ative somente se o pet desaparecer.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary btn-xl" style={{ flex: 1 }} onClick={handleBack} disabled={loading}>
              ← Voltar
            </button>
            <button type="button" className="btn btn-primary btn-xl" style={{ flex: 2 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner" /> Salvando...</> : petId ? 'Salvar Perfil' : 'Criar Perfil ✨'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Success (New Pet Only)
  if (step === 4) {
    return (
      <div className="wizard-step" style={{ textAlign: 'center' }}>
        <div className="animate-slide-in">
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Pronto! O {form.name} agora tem um PetPass.
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '1.0625rem', marginBottom: '32px' }}>
            Uma identidade digital completa para proteger seu companheiro.
          </p>

          <div style={{ background: 'var(--surface-2)', padding: '32px', borderRadius: 'var(--r-2xl)', marginBottom: '32px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>📱</div>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Próximo passo:</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9375rem', maxWidth: '300px', margin: '0 auto' }}>
              Vá para o Dashboard para ver e baixar o QR Code exclusivo do seu pet.
            </p>
          </div>

          <button type="button" className="btn btn-primary btn-xl w-full" onClick={onSuccess}>
            Ir para o Dashboard
          </button>
        </div>
      </div>
    )
  }

  return null
}
