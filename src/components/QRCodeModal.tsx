import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
import type { Pet } from '@/lib/types'

interface QRCodeModalProps {
  pet: Pet
  onClose: () => void
}

export function QRCodeModal({ pet, onClose }: QRCodeModalProps) {
  const { profile } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const petUrl = `${window.location.origin}/pet/${pet.id}`
  const hasWhatsapp = Boolean(profile?.whatsapp)

  useEffect(() => {
    if (canvasRef.current && hasWhatsapp) {
      QRCode.toCanvas(canvasRef.current, petUrl, {
        width: 260,
        margin: 2,
        color: { dark: '#1A1D2E', light: '#FFFFFF' },
      })
    }
  }, [petUrl, hasWhatsapp])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qrcode-${pet.name.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <h3 className="modal-title">QR Code de {pet.name}</h3>
        
        {!hasWhatsapp ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📱</div>
            <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Contato ausente</h4>
            <p className="text-muted text-sm mb-6">
              Adicione um WhatsApp para garantir que quem encontrar seu pet consiga falar com você.
            </p>
            <div className="modal-actions" style={{ flexDirection: 'column' }}>
              <Link to="/perfil" className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Configurar WhatsApp
              </Link>
              <button className="btn btn-ghost" onClick={onClose} style={{ width: '100%' }}>
                Voltar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm mb-6">
              Aponte a câmera para ler o QR Code e ser redirecionado ao perfil do pet.
            </p>

            <div className="qr-canvas-wrapper">
              <canvas ref={canvasRef} />
            </div>

            <p className="text-sm text-muted mb-6" style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
              🔗 {petUrl}
            </p>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleDownload}>
                ⬇️ Baixar PNG
              </button>
              <button className="btn btn-ghost" onClick={onClose}>
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
