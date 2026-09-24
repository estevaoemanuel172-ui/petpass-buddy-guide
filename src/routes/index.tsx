import { createFileRoute, Link } from '@tanstack/react-router'
import { PublicLayout } from '@/components/Layout'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// Mini QR Code visual (SVG pattern)
function QrMini() {
  const pattern = [
    [1,1,1,0,1,1,1],[1,0,1,0,1,0,1],[1,1,1,0,1,1,1],[0,0,0,0,0,0,0],[1,1,1,0,1,1,1],[1,0,1,0,1,0,1],[1,1,1,0,1,1,1]
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 8px)', gap: '2px' }}>
      {pattern.flat().map((cell, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: cell ? '#0F172A' : 'transparent' }} />
      ))}
    </div>
  )
}

function LandingPage() {
  return (
    <PublicLayout>
      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left: text */}
            <div className="animate-fade-up">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Identidade digital para pets
              </div>

              <h1 className="display-xl hero-title">
                Seu pet não fala.<br />
                <span>O PetPass<br />fala por ele.</span>
              </h1>

              <p className="hero-subtitle">
                Uma identidade digital para proteger seu pet e facilitar
                o reencontro caso ele seja encontrado.
              </p>

              <div className="hero-actions">
                <Link to="/cadastro" className="btn btn-primary btn-xl">
                  Proteger meu pet gratuitamente
                </Link>
                <a href="#como-funciona" className="btn btn-secondary btn-lg">
                  Ver como funciona
                </a>
              </div>

              <div className="hero-trust">
                <span>🔒 100% gratuito</span>
                <span className="hero-trust-dot" />
                <span>Sem cartão de crédito</span>
                <span className="hero-trust-dot" />
                <span>Mais segurança para quem você ama</span>
              </div>
            </div>

            {/* Right: visual */}
            <div className="hero-visual animate-fade-up animate-delay-2">
              <div className="hero-photo-wrap">
                <img src="/hero-dog.jpg" alt="Golden retriever com identificação PetPass na coleira" />

                {/* Pet badge overlay */}
                <div className="hero-photo-badge">
                  <div className="hero-badge-avatar">🐕</div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>Thor</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● Pet protegido</div>
                  </div>
                </div>

                {/* QR Code overlay */}
                <div className="hero-badge-qr">
                  <QrMini />
                  <div style={{ fontSize: '0.625rem', color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.04em' }}>QR CODE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section className="steps-section" id="como-funciona">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Como funciona</div>
            <h2 className="display-lg">Proteção simples.<br />Em poucos minutos.</h2>
            <p className="section-subtitle">
              Do cadastro ao QR Code na coleira, tudo em menos de 5 minutos.
            </p>
          </div>

          <div className="steps-grid">
            {[
              { n: '01', icon: '📋', title: 'Cadastre seu pet', desc: 'Adicione as informações do seu pet: foto, nome, raça, características e dados de saúde importantes.' },
              { n: '02', icon: '🔲', title: 'Gere o QR Code', desc: 'Receba automaticamente um QR Code exclusivo que aponta para o perfil digital do seu pet.' },
              { n: '03', icon: '🏷️', title: 'Facilite o reencontro', desc: 'Coloque o QR Code na coleira. Quem encontrar seu pet pode escanear e entrar em contato imediatamente.' },
            ].map(({ n, icon, title, desc }) => (
              <div className="step-item" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-icon-wrap">{icon}</div>
                <div className="step-title">{title}</div>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENEFÍCIOS ─── */}
      <section className="benefits-section" id="beneficios">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Recursos</div>
            <h2 className="display-lg">Mais do que um QR Code.</h2>
            <p className="section-subtitle">
              Uma plataforma completa para a segurança e identificação do seu pet.
            </p>
          </div>

          <div className="benefits-grid">
            {[
              { icon: '📱', title: 'Perfil digital completo', desc: 'Todas as informações importantes do seu pet em um só lugar. Foto, raça, características e contato rápido.' },
              { icon: '💬', title: 'Contato rápido', desc: 'Quem encontrar seu pet pode falar com você imediatamente pelo WhatsApp, sem precisar de aplicativo.' },
              { icon: '🔒', title: 'Privacidade protegida', desc: 'Seu endereço, e-mail e dados pessoais permanecem protegidos. Apenas o necessário é compartilhado.' },
              { icon: '🚨', title: 'Alerta de pet perdido', desc: 'Ative o modo perdido e o perfil público exibe um alerta vermelho com chamada para contato urgente.' },
            ].map(({ icon, title, desc }) => (
              <div className="benefit-card" key={title}>
                <div className="benefit-icon">{icon}</div>
                <div className="benefit-title">{title}</div>
                <p className="benefit-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMONSTRAÇÃO ─── */}
      <section className="demo-section" id="seguranca">
        <div className="container">
          <div className="demo-grid">
            <div className="demo-text">
              <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>Demonstração</div>
              <h2 className="display-lg" style={{ color: '#fff', marginBottom: '16px' }}>
                Veja como funciona quando seu pet é encontrado.
              </h2>
              <p>
                Alguém encontra seu pet, escaneia o QR Code da coleira e é
                redirecionado imediatamente para o perfil do animal — com botão
                de contato direto para você.
              </p>

              <div className="demo-flow">
                {['Escaneia QR Code', '→', 'Abre o perfil', '→', 'Entra em contato'].map((s, i) => (
                  s === '→'
                    ? <span key={i} className="demo-flow-arrow">{s}</span>
                    : <div key={i} className="demo-flow-step">{s}</div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div>
              <div className="demo-phone-mockup">
                <div className="demo-phone-bar">
                  <div className="demo-phone-dot" />
                </div>
                <div className="demo-phone-body">
                  <div className="demo-profile-card">
                    <div className="demo-profile-header">
                      <div className="demo-profile-avatar">🐕</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem' }}>Thor</div>
                      <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>Golden Retriever</div>
                    </div>
                    <div className="demo-profile-body">
                      <div className="demo-info-row">
                        <span className="demo-info-label">Sexo</span>
                        <span className="demo-info-value">Macho</span>
                      </div>
                      <div className="demo-info-row">
                        <span className="demo-info-label">Cor</span>
                        <span className="demo-info-value">Dourado</span>
                      </div>
                      <div className="demo-info-row" style={{ borderBottom: 'none' }}>
                        <span className="demo-info-label">Idade</span>
                        <span className="demo-info-value">5 anos</span>
                      </div>
                      <div className="demo-contact-btn">💬 Entrar em contato</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONFIANÇA ─── */}
      <section className="trust-section">
        <div className="container">
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>Por que o PetPass?</div>
          <h2 className="display-lg text-center">
            Pensado para proteger<br />o que mais importa.
          </h2>

          <div className="trust-grid">
            {[
              { icon: '🔒', label: 'Privacidade protegida' },
              { icon: '📡', label: 'Perfil sempre disponível' },
              { icon: '🔲', label: 'QR Code exclusivo' },
              { icon: '⚡', label: 'Contato imediato' },
            ].map(({ icon, label }) => (
              <div className="trust-item" key={label}>
                <div className="trust-icon">{icon}</div>
                <div className="trust-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            Grátis para sempre
          </div>
          <h2 className="display-lg" style={{ color: '#fff' }}>
            Seu pet merece<br />uma identidade.
          </h2>
          <p>
            Cadastre seus pets agora e tenha mais tranquilidade todos os dias.
          </p>
          <Link to="/cadastro" className="btn btn-cta-white btn-xl">
            🐾 Criar PetPass grátis
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
