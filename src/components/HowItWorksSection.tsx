import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

// ============================================================================
// CONFIGURAÇÃO DO VÍDEO TUTORIAL:
// Se você tiver uma URL direta de vídeo (ex: /video/tutorial.mp4 ou https://...),
// basta preencher abaixo. Quando estiver vazio (''), uma demonstração visual
// dinâmica dos 12 passos é executada de forma interativa.
// ============================================================================
export const TUTORIAL_VIDEO_URL = '';

interface TutorialStep {
  step: number;
  title: string;
  desc: string;
  badge: string;
  icon: string;
}

const FLOW_STEPS: TutorialStep[] = [
  { step: 1, title: 'Criar uma conta no PetPass', desc: 'Acesse o site e cadastre-se em segundos com seu e-mail e WhatsApp.', badge: 'Início', icon: '👤' },
  { step: 2, title: 'Fazer login', desc: 'Entre no seu painel seguro do tutor para gerenciar seus pets.', badge: 'Login', icon: '🔑' },
  { step: 3, title: 'Clicar em "Adicionar pet"', desc: 'Inicie o cadastro do seu cão ou gato com facilidade.', badge: 'Novo Pet', icon: '🐾' },
  { step: 4, title: 'Adicionar a foto do pet', desc: 'Envie uma foto clara e recente do seu companheiro.', badge: 'Foto', icon: '📸' },
  { step: 5, title: 'Preencher os dados do pet', desc: 'Informe nome, raça, porte, idade e contatos de emergência.', badge: 'Dados', icon: '📝' },
  { step: 6, title: 'Salvar o cadastro', desc: 'Seus dados ficam protegidos com segurança na nuvem.', badge: 'Salvo', icon: '✅' },
  { step: 7, title: 'Abrir o perfil do pet', desc: 'Visualize o perfil público completo que será acessado ao escanear.', badge: 'Perfil', icon: '📱' },
  { step: 8, title: 'Clicar em "Baixar QR Code"', desc: 'Gere instantaneamente o arquivo em alta resolução pronto para impressão.', badge: 'QR Code', icon: '⚡' },
  { step: 9, title: 'Visualizar o arquivo baixado', desc: 'Arquivo limpo, legível e otimizado para o tamanho da coleira.', badge: 'Arquivo', icon: '🖼️' },
  { step: 10, title: 'Imprimir o QR Code', desc: 'Imprima em papel comum, fotográfico ou papel mais encorpado.', badge: 'Impressão', icon: '🖨️' },
  { step: 11, title: 'Recortar a identificação', desc: 'Recorte ao redor da marcação e, se desejar, plastifique para maior durabilidade.', badge: 'Recorte', icon: '✂️' },
  { step: 12, title: 'Colocar na coleira do pet', desc: 'Prenda na argola ou coleira do pet e garanta proteção 24h por dia!', badge: 'Concluído', icon: '🐕' },
];

export function HowItWorksSection() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const stepDuration = 3800; // 3.8s por etapa na demonstração

  useEffect(() => {
    if (TUTORIAL_VIDEO_URL) return;
    if (!isPlaying) return;

    const interval = 100;
    const stepIncrement = (interval / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStepIndex((curr) => (curr + 1) % FLOW_STEPS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!videoWrapperRef.current) return;
    if (!document.fullscreenElement) {
      videoWrapperRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleStepSelect = (idx: number) => {
    setCurrentStepIndex(idx);
    setProgress(0);
  };

  const activeStep = FLOW_STEPS[currentStepIndex];

  return (
    <section className="how-it-works-section" id="como-funciona">
      <div className="container">
        {/* ─── 1. CABEÇALHO DO VÍDEO TUTORIAL ─── */}
        <div className="section-header text-center" style={{ maxWidth: 760, margin: '0 auto var(--s12)' }}>
          <div className="section-eyebrow">Como funciona</div>
          <h2 className="display-lg">
            Veja como proteger seu pet em poucos minutos
          </h2>
          <p className="section-subtitle" style={{ margin: 'var(--s3) auto 0' }}>
            Aprenda passo a passo como cadastrar seu pet, gerar o QR Code e colocar a identificação na coleira.
          </p>
        </div>

        {/* ─── VÍDEO / DEMO PLAYER PROFISSIONAL ─── */}
        <div className="tutorial-player-wrapper" ref={videoWrapperRef}>
          {TUTORIAL_VIDEO_URL ? (
            <div className="tutorial-native-video">
              <video
                src={TUTORIAL_VIDEO_URL}
                controls
                className="tutorial-video-element"
                poster="/hero-dog.jpg"
              >
                Seu navegador não suporta reprodução de vídeo.
              </video>
            </div>
          ) : (
            <div className="tutorial-interactive-player">
              {/* Top Bar do Player */}
              <div className="player-topbar">
                <div className="player-dots">
                  <span className="p-dot red" />
                  <span className="p-dot yellow" />
                  <span className="p-dot green" />
                </div>
                <div className="player-title-badge">
                  Tutorial Passo a Passo • Passo {activeStep.step} de 12: {activeStep.badge}
                </div>
                <div className="player-live-tag">
                  <span className="live-pulse" />
                  DEMO GUIADA
                </div>
              </div>

              {/* Área Principal Visual da Animação */}
              <div className="player-screen-stage">
                <div className="player-screen-content animate-fade-in" key={activeStep.step}>
                  {/* Mockups Visuais conforme o passo atual */}
                  {activeStep.step <= 3 && (
                    <div className="stage-mockup stage-account">
                      <div className="mockup-browser-card">
                        <div className="mockup-header-row">
                          <div className="mockup-logo">🐾 PetPass</div>
                          <div className="mockup-user-pill">Painel do Tutor 👋</div>
                        </div>
                        <div className="mockup-hero-box">
                          <h3>Painel de Proteção do Pet</h3>
                          <p>Cadastre e gerencie as identidades digitais com rapidez e segurança.</p>
                          <button className="mockup-btn-primary animate-pulse-subtle">
                            + Adicionar pet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep.step >= 4 && activeStep.step <= 6 && (
                    <div className="stage-mockup stage-form">
                      <div className="mockup-form-card">
                        <div className="mockup-avatar-upload">
                          <div className="mockup-pet-photo">🐕</div>
                          <div>
                            <strong>Foto de Thor</strong>
                            <span>Foto carregada com sucesso</span>
                          </div>
                        </div>
                        <div className="mockup-input-grid">
                          <div className="mockup-input-field">
                            <label>Nome do pet</label>
                            <div className="mockup-input-value">Thor</div>
                          </div>
                          <div className="mockup-input-field">
                            <label>Espécie / Raça</label>
                            <div className="mockup-input-value">Cão • Golden Retriever</div>
                          </div>
                          <div className="mockup-input-field">
                            <label>WhatsApp do Tutor</label>
                            <div className="mockup-input-value">(11) 99999-8888</div>
                          </div>
                          <div className="mockup-input-field">
                            <label>Porte / Sexo</label>
                            <div className="mockup-input-value">Grande • Macho</div>
                          </div>
                        </div>
                        <div className="mockup-btn-save">
                          <span>✓ Cadastro salvo com sucesso</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep.step === 7 && (
                    <div className="stage-mockup stage-profile">
                      <div className="mockup-phone-preview">
                        <div className="mockup-phone-notch" />
                        <div className="mockup-phone-header">
                          <div className="mockup-phone-avatar">🐕</div>
                          <h4>Thor</h4>
                          <span className="mockup-status-safe">● Pet Protegido</span>
                        </div>
                        <div className="mockup-phone-info">
                          <div><span>Raça:</span> Golden Retriever</div>
                          <div><span>Tutor:</span> Eduardo Silva</div>
                          <div><span>Contato:</span> WhatsApp protegido</div>
                        </div>
                        <div className="mockup-phone-cta">💬 Falar com o Tutor</div>
                      </div>
                    </div>
                  )}

                  {(activeStep.step === 8 || activeStep.step === 9) && (
                    <div className="stage-mockup stage-download">
                      <div className="mockup-qr-download-card">
                        <div className="qr-box-highlight">
                          <div className="qr-matrix-sim">
                            <div className="qr-sim-corner top-left" />
                            <div className="qr-sim-corner top-right" />
                            <div className="qr-sim-corner bottom-left" />
                            <div className="qr-sim-center">🐾</div>
                          </div>
                        </div>
                        <div className="qr-download-action">
                          <span className="qr-file-badge">📥 petpass-thor-qrcode.png</span>
                          <button className="mockup-btn-primary">
                            Baixar QR Code de Identificação
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep.step === 10 && (
                    <div className="stage-mockup stage-print">
                      <div className="mockup-print-sheet">
                        <div className="sheet-header">🖨️ Folha de Impressão PetPass</div>
                        <div className="sheet-cutout-box">
                          <div className="sheet-tag-preview">
                            <div className="sheet-qr">🔲</div>
                            <div className="sheet-text">
                              <strong>THOR</strong>
                              <small>Escaneie se encontrado</small>
                            </div>
                          </div>
                        </div>
                        <div className="sheet-guide-lines">Linhas de corte demarcadas para a coleira</div>
                      </div>
                    </div>
                  )}

                  {activeStep.step >= 11 && (
                    <div className="stage-mockup stage-collar">
                      <div className="mockup-collar-display">
                        <div className="collar-strap">
                          <div className="collar-buckle">🔒</div>
                          <div className="collar-tag-attached">
                            <div className="tag-ring">⭕</div>
                            <div className="tag-plate">
                              <span className="tag-qr-icon">🔲</span>
                              <div className="tag-pet-name">THOR</div>
                              <span className="tag-scan-hint">PetPass</span>
                            </div>
                          </div>
                        </div>
                        <div className="collar-success-badge">
                          ✨ Identificação Fixada com Sucesso na Coleira!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overlay explicativo do passo atual */}
                  <div className="player-step-overlay">
                    <div className="step-badge-pill">
                      <span>{activeStep.icon}</span> Etapa {activeStep.step} de 12
                    </div>
                    <h3 className="step-overlay-title">{activeStep.title}</h3>
                    <p className="step-overlay-desc">{activeStep.desc}</p>
                  </div>
                </div>
              </div>

              {/* Barra de Controles do Player */}
              <div className="player-controls-bar">
                <button
                  type="button"
                  className="player-ctrl-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pausar tutorial' : 'Iniciar tutorial'}
                  title={isPlaying ? 'Pausar' : 'Play'}
                >
                  {isPlaying ? '⏸️ Pausar' : '▶️ Play'}
                </button>

                {/* Linha do tempo / Progresso */}
                <div className="player-timeline-wrapper">
                  <div className="player-timeline-track">
                    <div
                      className="player-timeline-fill"
                      style={{
                        width: `${((currentStepIndex + progress / 100) / FLOW_STEPS.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="player-time-display">
                  Passo {currentStepIndex + 1}/{FLOW_STEPS.length}
                </div>

                {/* Volume / Mudo */}
                <button
                  type="button"
                  className="player-ctrl-btn icon-only"
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Ativar som' : 'Sem som'}
                  aria-label="Controle de áudio"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                {/* Tela cheia */}
                <button
                  type="button"
                  className="player-ctrl-btn icon-only"
                  onClick={toggleFullscreen}
                  title="Tela cheia"
                  aria-label="Tela cheia"
                >
                  {isFullscreen ? '🗗' : '⛶'}
                </button>
              </div>

              {/* Miniaturas de Passos Rápidos */}
              <div className="player-steps-nav">
                {FLOW_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    type="button"
                    className={`player-step-tab ${idx === currentStepIndex ? 'active' : ''}`}
                    onClick={() => handleStepSelect(idx)}
                  >
                    <span className="tab-num">{s.step < 10 ? `0${s.step}` : s.step}</span>
                    <span className="tab-label">{s.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chamada sutil abaixo do vídeo */}
        <p className="tutorial-subcallout text-center">
          <strong>Não sabe por onde começar?</strong> Assista ao tutorial e veja como é fácil.
        </p>

        {/* ─── 2. GUIA PASSO A PASSO (4 ETAPAS VISUAIS) ─── */}
        <div className="how-to-use-guide-wrapper" style={{ marginTop: 'var(--s16)' }}>
          <div className="section-header text-center" style={{ marginBottom: 'var(--s10)' }}>
            <div className="section-eyebrow">Como usar seu PetPass</div>
            <h2 className="display-lg">Como usar seu PetPass</h2>
            <p className="section-subtitle" style={{ margin: 'var(--s2) auto 0' }}>
              4 etapas simples para garantir a segurança e localização do seu pet.
            </p>
          </div>

          <div className="how-to-use-grid">
            {/* ETAPA 01 */}
            <div className="how-step-card">
              <div className="how-step-num">01</div>
              <div className="how-step-icon-wrap">
                <span className="how-step-icon">📸</span>
              </div>
              <h3 className="how-step-title">Cadastre seu pet</h3>
              <p className="how-step-desc">
                Adicione a foto e as informações do seu pet.
              </p>
              <div className="how-step-visual-pill">Foto e dados cadastrados</div>
            </div>

            {/* ETAPA 02 */}
            <div className="how-step-card">
              <div className="how-step-num">02</div>
              <div className="how-step-icon-wrap">
                <span className="how-step-icon">🔲</span>
              </div>
              <h3 className="how-step-title">Gere seu QR Code</h3>
              <p className="how-step-desc">
                Acesse o perfil do pet e baixe o QR Code.
              </p>
              <div className="how-step-visual-pill">Download com 1 clique</div>
            </div>

            {/* ETAPA 03 */}
            <div className="how-step-card">
              <div className="how-step-num">03</div>
              <div className="how-step-icon-wrap">
                <span className="how-step-icon">🖨️</span>
              </div>
              <h3 className="how-step-title">Imprima</h3>
              <p className="how-step-desc">
                Imprima a identificação em papel ou material adequado.
              </p>
              <div className="how-step-visual-pill">Pronto para recortar</div>
            </div>

            {/* ETAPA 04 */}
            <div className="how-step-card">
              <div className="how-step-num">04</div>
              <div className="how-step-icon-wrap">
                <span className="how-step-icon">🏷️</span>
              </div>
              <h3 className="how-step-title">Coloque na coleira</h3>
              <p className="how-step-desc">
                Fixe a identificação na coleira para que ela possa ser consultada caso seu pet seja encontrado.
              </p>
              <div className="how-step-visual-pill highlight">Pet protegido 24h</div>
            </div>
          </div>
        </div>

        {/* ─── 3. CAIXA DE DICAS: COMO COLOCAR NA COLEIRA ─── */}
        <div className="collar-tips-card">
          <div className="collar-tips-header">
            <span className="collar-tips-icon">💡</span>
            <div>
              <h3 className="collar-tips-title">Dica: como colocar o QR Code na coleira</h3>
              <p className="collar-tips-intro">
                Você não precisa comprar uma tag personalizada. Baixe o arquivo do PetPass,
                imprima e coloque a identificação na coleira do seu pet.
              </p>
            </div>
          </div>

          <div className="collar-recommendations-grid">
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Imprima em tamanho pequeno e legível.</span>
            </div>
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Use papel mais resistente ou plastifique a impressão para aumentar a durabilidade.</span>
            </div>
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Recorte cuidadosamente ao redor da identificação.</span>
            </div>
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Prenda de forma segura na coleira.</span>
            </div>
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Certifique-se de que o QR Code fique visível e não esteja dobrado ou danificado.</span>
            </div>
            <div className="rec-item">
              <span className="rec-check">✓</span>
              <span>Teste o QR Code com a câmera do celular antes de colocar na coleira.</span>
            </div>
            <div className="rec-item full-width">
              <span className="rec-check">✓</span>
              <span>Verifique periodicamente se a identificação continua legível.</span>
            </div>
          </div>
        </div>

        {/* ─── 4. AVISO IMPORTANTE ─── */}
        <div className="important-notice-box">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <strong>Importante:</strong> O PetPass fornece a identificação digital e o QR Code. A impressão e a forma de fixação na coleira são responsabilidade do usuário.
          </div>
        </div>

        {/* ─── 6. CTA DA SEÇÃO ─── */}
        <div className="section-cta-banner">
          <div className="cta-banner-content">
            <h3 className="cta-banner-title">Pronto para proteger seu pet?</h3>
            <p className="cta-banner-subtitle">
              Crie sua conta e proteja seus pets por apenas R$ 10/mês.
            </p>
          </div>
          <div className="cta-banner-action">
            <Link to="/cadastro" className="btn btn-primary btn-xl cta-glow">
              Começar agora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
