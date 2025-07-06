import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

async function ensureTablesExist() {
  try {
    // Criar tabela de agentes primeiro
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
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Garantir que as tabelas existem
    await ensureTablesExist()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const featured = searchParams.get("featured") === "true"

    let properties

    if (featured) {
      properties = await sql`
        SELECT 
          p.*,
          a.name as agent_name,
          a.phone as agent_phone,
          a.whatsapp as agent_whatsapp,
          a.email as agent_email
        FROM properties p
        LEFT JOIN agents a ON p.agent_id = a.id
        WHERE p.is_active = true AND p.is_featured = true
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      properties = await sql`
        SELECT 
          p.*,
          a.name as agent_name,
          a.phone as agent_phone,
          a.whatsapp as agent_whatsapp,
          a.email as agent_email
        FROM properties p
        LEFT JOIN agents a ON p.agent_id = a.id
        WHERE p.is_active = true
        ORDER BY p.is_featured DESC, p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return NextResponse.json({
      success: true,
      data: properties,
      total: properties.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Garantir que as tabelas existem
    await ensureTablesExist()

    const body = await request.json()
    const {
      title,
      description,
      property_type,
      transaction_type,
      price,
      area,
      bedrooms,
      bathrooms,
      parking_spaces,
      address,
      neighborhood,
      city,
      state,
      zip_code,
      images,
      features,
      agent_id,
      is_featured = false,
    } = body

    // Validações básicas
    if (!title || !property_type || !transaction_type || !price || !city || !state) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO properties (
        title, description, property_type, transaction_type, price, area,
        bedrooms, bathrooms, parking_spaces, address, neighborhood, city, state,
        zip_code, images, features, agent_id, is_featured
      ) VALUES (
        ${title}, ${description}, ${property_type}, ${transaction_type}, ${price}, ${area},
        ${bedrooms}, ${bathrooms}, ${parking_spaces}, ${address}, ${neighborhood}, ${city}, ${state},
        ${zip_code}, ${JSON.stringify(images)}, ${JSON.stringify(features)}, ${agent_id}, ${is_featured}
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Property created successfully",
    })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ success: false, error: "Failed to create property" }, { status: 500 })
  }
}
