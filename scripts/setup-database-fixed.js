// Script corrigido para configurar o banco Neon
async function setupDatabase() {
  // COLE SUA DATABASE_URL AQUI (substitua a linha abaixo)
  const DATABASE_URL = "postgresql://username:password@host/database?sslmode=require"

  console.log("🚀 Iniciando configuração do banco...")

  try {
    // Importar o Neon de forma mais compatível
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(DATABASE_URL)

    // Teste de conexão
    console.log("🔌 Testando conexão...")
    const testResult = await sql`SELECT NOW() as current_time`
    console.log("✅ Conexão OK! Hora atual:", testResult[0].current_time)

    // Criar tabelas uma por vez para evitar erros
    console.log("📋 Criando tabelas...")

    // 1. Agentes
    try {
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
    } catch (e) {
      console.log("⚠️ Tabela 'agents' já existe ou erro:", e.message)
    }

    // 2. Propriedades
    try {
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
          images TEXT,
          features TEXT,
          agent_id INTEGER,
          is_featured BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          views_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ Tabela 'properties' criada")
    } catch (e) {
      console.log("⚠️ Tabela 'properties' já existe ou erro:", e.message)
    }

    // 3. Leads
    try {
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
          property_id INTEGER,
          agent_id INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ Tabela 'leads' criada")
    } catch (e) {
      console.log("⚠️ Tabela 'leads' já existe ou erro:", e.message)
    }

    // 4. Favoritos
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS favorites (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          property_id INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ Tabela 'favorites' criada")
    } catch (e) {
      console.log("⚠️ Tabela 'favorites' já existe ou erro:", e.message)
    }

    // 5. Analytics
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(100) NOT NULL,
          event_type VARCHAR(50) NOT NULL,
          event_data TEXT,
          user_agent TEXT,
          ip_address VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      console.log("✅ Tabela 'analytics_events' criada")
    } catch (e) {
      console.log("⚠️ Tabela 'analytics_events' já existe ou erro:", e.message)
    }

    // Verificar se já existem dados
    const agentCount = await sql`SELECT COUNT(*) as count FROM agents`
    console.log(`📊 Agentes existentes: ${agentCount[0].count}`)

    if (Number.parseInt(agentCount[0].count) === 0) {
      console.log("🌱 Inserindo dados de exemplo...")

      // Inserir agentes
      try {
        await sql`
          INSERT INTO agents (name, email, phone, whatsapp, creci, bio) VALUES
          ('Carlos Silva', 'carlos@imovelprime.com.br', '(11) 3000-0001', '5511999887766', 'CRECI-SP 123456', 'Especialista em imóveis residenciais'),
          ('Ana Costa', 'ana@imovelprime.com.br', '(11) 3000-0002', '5511988776655', 'CRECI-SP 234567', 'Corretora sênior especializada em apartamentos'),
          ('Roberto Lima', 'roberto@imovelprime.com.br', '(11) 3000-0003', '5511977665544', 'CRECI-SP 345678', 'Especialista em locações')
        `
        console.log("✅ Agentes inseridos")
      } catch (e) {
        console.log("⚠️ Erro ao inserir agentes:", e.message)
      }

      // Inserir propriedades
      try {
        await sql`
          INSERT INTO properties (
            title, description, property_type, transaction_type, price, area, 
            bedrooms, bathrooms, parking_spaces, address, neighborhood, city, state, 
            zip_code, images, features, agent_id, is_featured
          ) VALUES
          (
            'Casa Moderna com Piscina',
            'Belíssima casa moderna com 4 quartos, piscina e jardim amplo.',
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
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Piscina,Churrasqueira,Jardim',
            1,
            true
          ),
          (
            'Apartamento de Luxo',
            'Apartamento alto padrão com vista panorâmica da cidade.',
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
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Vista Panorâmica,Acabamento Premium',
            2,
            true
          ),
          (
            'Casa Familiar',
            'Casa espaçosa perfeita para famílias.',
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
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'Quintal Amplo,Área Gourmet',
            3,
            false
          )
        `
        console.log("✅ Propriedades inseridas")
      } catch (e) {
        console.log("⚠️ Erro ao inserir propriedades:", e.message)
      }

      // Inserir leads de exemplo
      try {
        await sql`
          INSERT INTO leads (name, email, phone, interest_type, message, agent_id) VALUES
          ('João Silva', 'joao@email.com', '(11) 99999-1111', 'comprar', 'Interessado em casa com piscina', 1),
          ('Maria Santos', 'maria@email.com', '(11) 99999-2222', 'alugar', 'Procuro apartamento', 2)
        `
        console.log("✅ Leads de exemplo inseridos")
      } catch (e) {
        console.log("⚠️ Erro ao inserir leads:", e.message)
      }
    } else {
      console.log("ℹ️ Dados já existem, pulando inserção...")
    }

    // Verificar resultado final
    const finalCounts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM agents) as agents,
        (SELECT COUNT(*) FROM properties) as properties,
        (SELECT COUNT(*) FROM leads) as leads
    `

    console.log("\n📊 RESUMO FINAL:")
    console.log(`👥 Agentes: ${finalCounts[0].agents}`)
    console.log(`🏠 Propriedades: ${finalCounts[0].properties}`)
    console.log(`📋 Leads: ${finalCounts[0].leads}`)

    console.log("\n🎉 CONFIGURAÇÃO CONCLUÍDA!")
    console.log("\n📝 Próximos passos:")
    console.log("1. Copie sua DATABASE_URL")
    console.log("2. Faça o deploy no Vercel")
    console.log("3. Adicione a DATABASE_URL nas variáveis de ambiente")
    console.log("4. Acesse /admin para ver o dashboard")

    return true
  } catch (error) {
    console.error("❌ ERRO PRINCIPAL:", error)
    console.log("\n🔍 DIAGNÓSTICO:")

    if (error.message.includes("connect")) {
      console.log("❌ Problema de conexão - verifique sua DATABASE_URL")
    } else if (error.message.includes("authentication")) {
      console.log("❌ Problema de autenticação - verifique usuário/senha")
    } else if (error.message.includes("database")) {
      console.log("❌ Problema com o banco - verifique se existe")
    } else {
      console.log("❌ Erro desconhecido:", error.message)
    }

    console.log("\n💡 SOLUÇÕES:")
    console.log("1. Verifique se a DATABASE_URL está correta")
    console.log("2. Confirme se o banco Neon está ativo")
    console.log("3. Tente criar um novo projeto no Neon")
    console.log("4. Aguarde alguns minutos e tente novamente")

    return false
  }
}

// Executar
setupDatabase()
