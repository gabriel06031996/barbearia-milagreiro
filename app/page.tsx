"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Carregar o script da landing page
    const script = document.createElement("script")
    script.src = "/script.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <h1 className="logo">Imovel Prime</h1>
          </div>
          <nav className="navigation">
            <ul className="nav-menu">
              <li>
                <a href="#inicio">Início</a>
              </li>
              <li>
                <a href="#imoveis">Imóveis</a>
              </li>
              <li>
                <a href="#sobre">Sobre</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
              <li>
                <a href="/admin" className="admin-link">
                  Admin
                </a>
              </li>
            </ul>
          </nav>
          <div className="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="hero-slider">
          <div className="slide active">
            <div
              className="slide-bg"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
              }}
            ></div>
            <div className="slide-content">
              <div className="container">
                <h1 className="hero-title">Encontre Sua Casa dos Sonhos</h1>
                <p className="hero-subtitle">Mais de 15 anos conectando famílias aos seus lares ideais</p>
                <div className="hero-cta">
                  <a href="#contato" className="cta-primary">
                    Fale Conosco
                  </a>
                  <a
                    href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os imóveis disponíveis."
                    className="cta-secondary"
                  >
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-badges">
            <div className="trust-badge">
              <i className="fas fa-certificate"></i>
              <span>CRECI Certificado</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-shield-alt"></i>
              <span>Transações Seguras</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-award"></i>
              <span>Prêmio Excelência</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-handshake"></i>
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10.000+</div>
              <div className="stat-label">Imóveis Vendidos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5.000+</div>
              <div className="stat-label">Famílias Felizes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfação</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="imoveis" className="properties-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Imóveis em Destaque</h2>
            <p className="section-subtitle">Selecionamos os melhores imóveis para você</p>
          </div>

          <div className="properties-grid">
            {/* Property 1 */}
            <div className="property-card" data-property-id="1">
              <div className="property-image">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Casa Moderna"
                />
                <div className="property-actions">
                  <button
                    className="action-btn favorite-btn"
                    onClick={() => window.toggleFavorite && window.toggleFavorite(this)}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
              <div className="property-content">
                <div className="property-price">R$ 850.000</div>
                <h3 className="property-title">Casa Moderna com Piscina</h3>
                <p className="property-description">Belíssima casa moderna com 4 quartos, piscina e jardim amplo.</p>
                <div className="property-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Jardins, São Paulo - SP</span>
                </div>
                <div className="property-features">
                  <div className="feature">
                    <i className="fas fa-bed"></i>
                    <span>4 Quartos</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-bath"></i>
                    <span>3 Banheiros</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-car"></i>
                    <span>2 Vagas</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-ruler-combined"></i>
                    <span>350m²</span>
                  </div>
                </div>
                <div className="property-agent">
                  <div className="agent-info">
                    <div className="agent-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="agent-details">
                      <span className="agent-name">Carlos Silva</span>
                      <span className="agent-title">Corretor Sênior</span>
                    </div>
                  </div>
                  <button
                    className="contact-agent"
                    onClick={() =>
                      window.contactAgent &&
                      window.contactAgent("Carlos Silva", "Casa Moderna com Piscina", "5511999887766")
                    }
                  >
                    <i className="fab fa-whatsapp"></i>
                    Contato
                  </button>
                </div>
              </div>
            </div>

            {/* Property 2 */}
            <div className="property-card" data-property-id="2">
              <div className="property-image">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Apartamento de Luxo"
                />
                <div className="property-actions">
                  <button
                    className="action-btn favorite-btn"
                    onClick={() => window.toggleFavorite && window.toggleFavorite(this)}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
              <div className="property-content">
                <div className="property-price">R$ 1.200.000</div>
                <h3 className="property-title">Apartamento de Luxo Vista Panorâmica</h3>
                <p className="property-description">Apartamento alto padrão com vista panorâmica da cidade.</p>
                <div className="property-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Vila Olímpia, São Paulo - SP</span>
                </div>
                <div className="property-features">
                  <div className="feature">
                    <i className="fas fa-bed"></i>
                    <span>3 Quartos</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-bath"></i>
                    <span>2 Banheiros</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-car"></i>
                    <span>2 Vagas</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-ruler-combined"></i>
                    <span>120m²</span>
                  </div>
                </div>
                <div className="property-agent">
                  <div className="agent-info">
                    <div className="agent-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="agent-details">
                      <span className="agent-name">Ana Costa</span>
                      <span className="agent-title">Especialista em Luxo</span>
                    </div>
                  </div>
                  <button
                    className="contact-agent"
                    onClick={() =>
                      window.contactAgent &&
                      window.contactAgent("Ana Costa", "Apartamento de Luxo Vista Panorâmica", "5511988776655")
                    }
                  >
                    <i className="fab fa-whatsapp"></i>
                    Contato
                  </button>
                </div>
              </div>
            </div>

            {/* Property 3 */}
            <div className="property-card" data-property-id="3">
              <div className="property-image">
                <img
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Casa Familiar"
                />
                <div className="property-actions">
                  <button
                    className="action-btn favorite-btn"
                    onClick={() => window.toggleFavorite && window.toggleFavorite(this)}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
              <div className="property-content">
                <div className="property-price">
                  R$ 4.500<span>/mês</span>
                </div>
                <h3 className="property-title">Casa Familiar Aconchegante</h3>
                <p className="property-description">Casa espaçosa perfeita para famílias, com quintal amplo.</p>
                <div className="property-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Morumbi, São Paulo - SP</span>
                </div>
                <div className="property-features">
                  <div className="feature">
                    <i className="fas fa-bed"></i>
                    <span>3 Quartos</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-bath"></i>
                    <span>2 Banheiros</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-car"></i>
                    <span>2 Vagas</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-ruler-combined"></i>
                    <span>200m²</span>
                  </div>
                </div>
                <div className="property-agent">
                  <div className="agent-info">
                    <div className="agent-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="agent-details">
                      <span className="agent-name">Roberto Lima</span>
                      <span className="agent-title">Especialista em Locação</span>
                    </div>
                  </div>
                  <button
                    className="contact-agent"
                    onClick={() =>
                      window.contactAgent &&
                      window.contactAgent("Roberto Lima", "Casa Familiar Aconchegante", "5511977665544")
                    }
                  >
                    <i className="fab fa-whatsapp"></i>
                    Contato
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <a href="#contato" className="cta-button">
              Ver Todos os Imóveis
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">O Que Nossos Clientes Dizem</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Excelente atendimento! Encontrei minha casa dos sonhos em apenas 2 semanas. Equipe muito profissional
                  e atenciosa."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Maria Silva</h4>
                  <span>Cliente Satisfeita</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Processo de compra muito transparente e seguro. Recomendo a Imovel Prime para quem busca qualidade e
                  confiança."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>João Santos</h4>
                  <span>Investidor</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Venderam meu apartamento pelo melhor preço do mercado. Equipe dedicada e resultados excepcionais!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Ana Costa</h4>
                  <span>Proprietária</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Entre em Contato</h2>
            <p className="section-subtitle">Estamos prontos para ajudar você a encontrar o imóvel ideal</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-info">
                    <h4>Telefone</h4>
                    <p>(11) 3000-0000</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon whatsapp">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="method-info">
                    <h4>WhatsApp</h4>
                    <p>(11) 99999-9999</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-info">
                    <h4>E-mail</h4>
                    <p>contato@imovelprime.com.br</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-info">
                    <h4>Endereço</h4>
                    <p>
                      Av. Paulista, 1000
                      <br />
                      São Paulo - SP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form
                className="contact-form"
                onSubmit={(e) => window.handleContactFormWithDB && window.handleContactFormWithDB(e.target)}
              >
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">WhatsApp</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>

                <div className="form-group">
                  <label htmlFor="interest">Interesse</label>
                  <select id="interest" name="interest" required>
                    <option value="">Selecione seu interesse</option>
                    <option value="comprar">Comprar Imóvel</option>
                    <option value="alugar">Alugar Imóvel</option>
                    <option value="vender">Vender Imóvel</option>
                    <option value="avaliar">Avaliar Imóvel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Conte-nos mais sobre o que você procura..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <i className="fas fa-paper-plane"></i>
                  Enviar Solicitação
                </button>

                <div className="form-guarantee">
                  <i className="fas fa-shield-alt"></i>
                  <span>Garantimos resposta em até 30 minutos</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Imovel Prime</h3>
              <p className="footer-description">
                Mais de 15 anos conectando famílias aos seus lares ideais com excelência e confiança.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Serviços</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Compra de Imóveis</a>
                </li>
                <li>
                  <a href="#">Venda de Imóveis</a>
                </li>
                <li>
                  <a href="#">Locação</a>
                </li>
                <li>
                  <a href="#">Avaliação</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-subtitle">Contato</h4>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-phone"></i> (11) 3000-0000
                </li>
                <li>
                  <i className="fab fa-whatsapp"></i> (11) 99999-9999
                </li>
                <li>
                  <i className="fas fa-envelope"></i> contato@imovelprime.com.br
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Imovel Prime. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
