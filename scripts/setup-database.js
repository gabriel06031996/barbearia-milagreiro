const { neon } = require("@neondatabase/serverless")

// COLE SUA DATABASE_URL AQUI
const DATABASE_URL = "COLE_SUA_DATABASE_URL_AQUI"

const sql = neon(DATABASE_URL)

async function setupDatabase() {
  console.log("🚀 Configurando banco de dados Neon...")

  try {
    // Teste de conexão
    console.log("🔌 Testando conexão...")
    await sql`SELECT NOW()`
    console.log("✅ Conexão estabelecida com sucesso!")

    // Criar todas as tabelas
    console.log("📋 Criando tabelas...")

    // 1. Tabela de agentes
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
    console.log("✅ Tabela 'agents' criada")

    // 2. Tabela de propriedades
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
    console.log("✅ Tabela 'properties' criada")

    // 3. Tabela de leads
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
    console.log("✅ Tabela 'leads' criada")

    // 4. Tabela de favoritos
    await sql`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_email, property_id)
      )
    `
    console.log("✅ Tabela 'favorites' criada")

    // 5. Tabela de analytics
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
    console.log("✅ Tabela 'analytics_events' criada")

    // 6. Tabela de configurações
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSONB,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Tabela 'site_settings' criada")

    // Criar índices
    console.log("📊 Criando índices...")
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id)`
    console.log("✅ Índices criados")

    // Inserir dados de exemplo
    console.log("🌱 Inserindo dados de exemplo...")

    // Verificar se já existem dados
    const agentCount = await sql`SELECT COUNT(*) as count FROM agents`

    if (Number.parseInt(agentCount[0].count) === 0) {
      // Inserir agentes
      await sql`
        INSERT INTO agents (name, email, phone, whatsapp, creci, bio) VALUES
        ('Carlos Silva', 'carlos@imovelprime.com.br', '(11) 3000-0001', '5511999887766', 'CRECI-SP 123456', 'Especialista em imóveis residenciais de alto padrão com mais de 10 anos de experiência.'),
        ('Ana Costa', 'ana@imovelprime.com.br', '(11) 3000-0002', '5511988776655', 'CRECI-SP 234567', 'Corretora sênior especializada em apartamentos de luxo na região da Vila Olímpia.'),
        ('Roberto Lima', 'roberto@imovelprime.com.br', '(11) 3000-0003', '5511977665544', 'CRECI-SP 345678', 'Especialista em locações residenciais e comerciais.'),
        ('Mariana Santos', 'mariana@imovelprime.com.br', '(11) 3000-0004', '5511966554433', 'CRECI-SP 456789', 'Corretora especializada em imóveis comerciais e investimentos.')
      `
      console.log("✅ Agentes inseridos")

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
        ),
        (
          'Cobertura Duplex Premium',
          'Cobertura duplex com terraço privativo, piscina exclusiva e vista deslumbrante. O mais alto padrão em acabamentos e localização.',
          'apartamento',
          'venda',
          2500000.00,
          280.00,
          4,
          4,
          3,
          'Av. Paulista, 1000',
          'Bela Vista',
          'São Paulo',
          'SP',
          '01310-100',
          '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Cobertura Duplex", "Terraço Privativo", "Piscina Exclusiva", "Vista Deslumbrante", "Acabamento Premium"]',
          2,
          true
        ),
        (
          'Apartamento Moderno Brooklin',
          'Apartamento novo com 2 quartos, sendo 1 suíte, em prédio moderno com infraestrutura completa no Brooklin Novo.',
          'apartamento',
          'aluguel',
          3200.00,
          75.00,
          2,
          2,
          1,
          'Rua Funchal, 200',
          'Brooklin',
          'São Paulo',
          'SP',
          '04551-060',
          '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Apartamento Novo", "Suíte", "Academia", "Piscina", "Salão de Festas"]',
          4,
          false
        ),
        (
          'Casa Térrea com Jardim',
          'Casa térrea charmosa com jardim frontal e quintal nos fundos. Ideal para quem busca tranquilidade sem abrir mão da localização.',
          'casa',
          'venda',
          680000.00,
          180.00,
          3,
          2,
          2,
          'Rua das Palmeiras, 567',
          'Vila Madalena',
          'São Paulo',
          'SP',
          '05435-010',
          '["https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Casa Térrea", "Jardim Frontal", "Quintal", "Localização Privilegiada"]',
          1,
          false
        )
      `
      console.log("✅ Propriedades inseridas")

      // Inserir configurações
      await sql`
        INSERT INTO site_settings (setting_key, setting_value, description) VALUES
        ('company_info', '{
          "name": "Imovel Prime",
          "phone": "(11) 3000-0000",
          "whatsapp": "5511999999999",
          "email": "contato@imovelprime.com.br",
          "address": "Av. Paulista, 1000 - São Paulo, SP"
        }', 'Informações da empresa'),
        ('site_stats', '{
          "properties_sold": 10000,
          "happy_families": 5000,
          "satisfaction_rate": 98,
          "years_experience": 15
        }', 'Estatísticas do site')
      `
      console.log("✅ Configurações inseridas")

      // Inserir alguns leads de exemplo
      await sql`
        INSERT INTO leads (name, email, phone, interest_type, message, agent_id) VALUES
        ('João Silva', 'joao@email.com', '(11) 99999-1111', 'comprar', 'Interessado em casa com piscina', 1),
        ('Maria Santos', 'maria@email.com', '(11) 99999-2222', 'alugar', 'Procuro apartamento na Vila Olímpia', 2),
        ('Pedro Costa', 'pedro@email.com', '(11) 99999-3333', 'vender', 'Quero vender minha casa', 3)
      `
      console.log("✅ Leads de exemplo inseridos")
    } else {
      console.log("ℹ️ Dados já existem, pulando inserção...")
    }

    // Verificar dados inseridos
    const counts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM agents) as agents,
        (SELECT COUNT(*) FROM properties) as properties,
        (SELECT COUNT(*) FROM leads) as leads
    `

    console.log("\n📊 RESUMO DO BANCO:")
    console.log(`👥 Agentes: ${counts[0].agents}`)
    console.log(`🏠 Propriedades: ${counts[0].properties}`)
    console.log(`📋 Leads: ${counts[0].leads}`)

    console.log("\n🎉 BANCO CONFIGURADO COM SUCESSO!")
    console.log("\n🔗 Sua DATABASE_URL:")
    console.log(DATABASE_URL)
    console.log("\n📝 Próximos passos:")
    console.log("1. Copie a DATABASE_URL acima")
    console.log("2. Cole nas variáveis de ambiente do Vercel")
    console.log("3. Faça o deploy do projeto")
    console.log("4. Acesse /admin para ver o dashboard")
  } catch (error) {
    console.error("❌ Erro ao configurar banco:", error)
    console.log("\n🔍 Possíveis soluções:")
    console.log("1. Verifique se a DATABASE_URL está correta")
    console.log("2. Confirme se o banco Neon está ativo")
    console.log("3. Tente novamente em alguns minutos")
  }
}

// Executar setup
setupDatabase()
