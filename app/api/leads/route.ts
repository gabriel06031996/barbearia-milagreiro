import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

async function ensureTablesExist() {
  try {
    // Criar tabela de agentes primeiro (referenciada por outras tabelas)
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

    // Criar tabela de propriedades
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

    // Criar tabela de leads
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

    // Inserir dados de exemplo se não existirem
    const agentCount = await sql`SELECT COUNT(*) as count FROM agents`

    if (Number.parseInt(agentCount[0].count) === 0) {
      await sql`
        INSERT INTO agents (name, email, phone, whatsapp, creci, bio) VALUES
        ('Carlos Silva', 'carlos@imovelprime.com.br', '(11) 3000-0001', '5511999887766', 'CRECI-SP 123456', 'Especialista em imóveis residenciais de alto padrão.'),
        ('Ana Costa', 'ana@imovelprime.com.br', '(11) 3000-0002', '5511988776655', 'CRECI-SP 234567', 'Corretora sênior especializada em apartamentos de luxo.'),
        ('Roberto Lima', 'roberto@imovelprime.com.br', '(11) 3000-0003', '5511977665544', 'CRECI-SP 345678', 'Especialista em locações residenciais e comerciais.')
      `

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
          '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Piscina", "Churrasqueira", "Jardim"]',
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
          '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
          '["Vista Panorâmica", "Acabamento Premium"]',
          2,
          true
        )
      `

      // Inserir alguns leads de exemplo
      await sql`
        INSERT INTO leads (name, email, phone, interest_type, message, agent_id) VALUES
        ('João Silva', 'joao@email.com', '(11) 99999-1111', 'comprar', 'Interessado em casa com piscina', 1),
        ('Maria Santos', 'maria@email.com', '(11) 99999-2222', 'alugar', 'Procuro apartamento na Vila Olímpia', 2),
        ('Pedro Costa', 'pedro@email.com', '(11) 99999-3333', 'vender', 'Quero vender minha casa', 3)
      `
    }
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Garantir que as tabelas existem
    await ensureTablesExist()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")

    let leads
    if (status) {
      leads = await sql`
        SELECT 
          l.*,
          p.title as property_title,
          a.name as agent_name
        FROM leads l
        LEFT JOIN properties p ON l.property_id = p.id
        LEFT JOIN agents a ON l.agent_id = a.id
        WHERE l.status = ${status}
        ORDER BY l.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      leads = await sql`
        SELECT 
          l.*,
          p.title as property_title,
          a.name as agent_name
        FROM leads l
        LEFT JOIN properties p ON l.property_id = p.id
        LEFT JOIN agents a ON l.agent_id = a.id
        ORDER BY l.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Buscar estatísticas dos leads
    const stats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM leads
      GROUP BY status
    `

    return NextResponse.json({
      success: true,
      data: leads,
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = Number.parseInt(stat.count)
        return acc
      }, {}),
      total: leads.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Garantir que as tabelas existem
    await ensureTablesExist()

    const body = await request.json()
    const { name, email, phone, interest_type, message, source = "landing_page", property_id, agent_id } = body

    // Validações básicas
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // Verificar se já existe um lead com este email recentemente (últimas 24h)
    const existingLead = await sql`
      SELECT id FROM leads 
      WHERE email = ${email} 
      AND created_at > NOW() - INTERVAL '24 hours'
      LIMIT 1
    `

    if (existingLead.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email already registered in the last 24 hours" },
        { status: 409 },
      )
    }

    // Determinar agente automaticamente se não especificado
    let assignedAgentId = agent_id
    if (!assignedAgentId && property_id) {
      const property = await sql`
        SELECT agent_id FROM properties WHERE id = ${property_id}
      `
      if (property.length > 0) {
        assignedAgentId = property[0].agent_id
      }
    }

    // Se ainda não tem agente, pegar um aleatório ativo
    if (!assignedAgentId) {
      const randomAgent = await sql`
        SELECT id FROM agents WHERE is_active = true ORDER BY RANDOM() LIMIT 1
      `
      if (randomAgent.length > 0) {
        assignedAgentId = randomAgent[0].id
      }
    }

    const result = await sql`
      INSERT INTO leads (
        name, email, phone, interest_type, message, source, property_id, agent_id
      ) VALUES (
        ${name}, ${email}, ${phone}, ${interest_type}, ${message}, ${source}, ${property_id}, ${assignedAgentId}
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Lead created successfully",
    })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ success: false, error: "Failed to create lead" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Garantir que as tabelas existem
    await ensureTablesExist()

    const body = await request.json()
    const { id, status, agent_id, notes } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE leads 
      SET 
        status = COALESCE(${status}, status),
        agent_id = COALESCE(${agent_id}, agent_id),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Lead updated successfully",
    })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 })
  }
}
