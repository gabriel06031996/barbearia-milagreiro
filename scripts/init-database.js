const { neon } = require("@neondatabase/serverless")

const sql = neon(process.env.DATABASE_URL)

async function initializeDatabase() {
  try {
    console.log("🚀 Inicializando banco de dados...")

    // Criar tabelas
    console.log("📋 Criando tabelas...")

    // Tabela de agentes imobiliários
    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        whatsapp VARCHAR(20),
        creci VARCHAR(50),
        photo_url TEXT,
        bio TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de propriedades
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        property_type VARCHAR(50) NOT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        area DECIMAL(8,2),
        bedrooms INTEGER,
        bathrooms INTEGER,
        parking_spaces INTEGER,
        address TEXT,
        neighborhood VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(2) NOT NULL,
        zip_code VARCHAR(10),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        images JSONB,
        features JSONB,
        agent_id INTEGER REFERENCES agents(id),
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de leads/contatos
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        interest_type VARCHAR(50),
        message TEXT,
        source VARCHAR(100) DEFAULT 'landing_page',
        status VARCHAR(20) DEFAULT 'novo',
        property_id INTEGER REFERENCES properties(id),
        agent_id INTEGER REFERENCES agents(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de favoritos
    await sql`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_email, property_id)
      )
    `

    // Tabela de newsletter
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        unsubscribed_at TIMESTAMP WITH TIME ZONE
      )
    `

    // Tabela de analytics/eventos
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB,
        user_agent TEXT,
        ip_address INET,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de configurações do site
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSONB,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log("✅ Tabelas criadas com sucesso!")

    // Criar índices
    console.log("📊 Criando índices...")

    await sql`CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_transaction ON properties(transaction_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price)`
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_favorites_user_email ON favorites(user_email)`

    console.log("✅ Índices criados com sucesso!")

    // Inserir dados de exemplo
    console.log("🌱 Inserindo dados de exemplo...")

    // Verificar se já existem agentes
    const existingAgents = await sql`SELECT COUNT(*) as count FROM agents`

    if (Number.parseInt(existingAgents[0].count) === 0) {
      // Inserir agentes
      await sql`
        INSERT INTO agents (name, email, phone, whatsapp, creci, bio) VALUES
        ('Carlos Silva', 'carlos@imovelprime.com.br', '(11) 3000-0001', '5511999887766', 'CRECI-SP 123456', 'Especialista em imóveis residenciais de alto padrão com mais de 10 anos de experiência.'),
        ('Ana Costa', 'ana@imovelprime.com.br', '(11) 3000-0002', '5511988776655', 'CRECI-SP 234567', 'Corretora sênior especializada em apartamentos de luxo na região da Vila Olímpia.'),
        ('Roberto Lima', 'roberto@imovelprime.com.br', '(11) 3000-0003', '5511977665544', 'CRECI-SP 345678', 'Especialista em locações residenciais e comerciais.'),
        ('Mariana Santos', 'mariana@imovelprime.com.br', '(11) 3000-0004', '5511966554433', 'CRECI-SP 456789', 'Corretora especializada em imóveis comerciais e investimentos.')
      `

      // Inserir propriedades
      await sql`
        INSERT INTO properties (
          title, description, property_type, transaction_type, price, area, 
          bedrooms, bathrooms, parking_spaces, address, neighborhood, city, state, 
          zip_code, images, features, agent_id, is_featured
        ) VALUES
        (
          'Casa Moderna com Piscina',
          'Belíssima casa moderna com 4 quartos, piscina, churrasqueira e jardim amplo. Localizada em condomínio fechado de alto padrão com segurança 24h.',
          'casa',
          'venda',
          850000.00,
          350.00,
          4,
          3,
          2,
          'Rua das Flores, 123',
          'Jardins',
          'São Paulo',
          'SP',
          '01234-567',
          '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Piscina", "Churrasqueira", "Jardim", "Segurança 24h", "Condomínio Fechado"]',
          1,
          true
        ),
        (
          'Apartamento de Luxo Vista Panorâmica',
          'Apartamento alto padrão com vista panorâmica da cidade, acabamentos de primeira qualidade e localização privilegiada no coração da Vila Olímpia.',
          'apartamento',
          'venda',
          1200000.00,
          120.00,
          3,
          2,
          2,
          'Av. das Nações Unidas, 456',
          'Vila Olímpia',
          'São Paulo',
          'SP',
          '04578-000',
          '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Vista Panorâmica", "Acabamento Premium", "Sacada", "Academia", "Salão de Festas"]',
          2,
          true
        ),
        (
          'Casa Familiar Aconchegante',
          'Casa espaçosa perfeita para famílias, com quintal amplo, área gourmet completa e próxima às melhores escolas da região do Morumbi.',
          'casa',
          'aluguel',
          4500.00,
          200.00,
          3,
          2,
          2,
          'Rua do Bosque, 789',
          'Morumbi',
          'São Paulo',
          'SP',
          '05651-030',
          '["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Quintal Amplo", "Área Gourmet", "Próximo a Escolas", "Garagem Coberta"]',
          3,
          false
        )
      `

      // Inserir configurações do site
      await sql`
        INSERT INTO site_settings (setting_key, setting_value, description) VALUES
        ('company_info', '{
          "name": "Imovel Prime",
          "phone": "(11) 3000-0000",
          "whatsapp": "5511999999999",
          "email": "contato@imovelprime.com.br",
          "address": "Av. Paulista, 1000 - São Paulo, SP",
          "social": {
            "facebook": "https://facebook.com/imovelprime",
            "instagram": "https://instagram.com/imovelprime",
            "linkedin": "https://linkedin.com/company/imovelprime"
          }
        }', 'Informações da empresa'),
        ('site_stats', '{
          "properties_sold": 10000,
          "happy_families": 5000,
          "satisfaction_rate": 98,
          "years_experience": 15
        }', 'Estatísticas do site')
      `

      console.log("✅ Dados de exemplo inseridos com sucesso!")
    } else {
      console.log("ℹ️ Dados já existem, pulando inserção...")
    }

    console.log("🎉 Banco de dados inicializado com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error)
    throw error
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("✅ Processo concluído!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Erro:", error)
      process.exit(1)
    })
}

module.exports = { initializeDatabase }
