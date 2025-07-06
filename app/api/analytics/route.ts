import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

async function ensureAnalyticsTableExists() {
  try {
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

    // Criar índices se não existirem
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at)`
  } catch (error) {
    console.error("Error ensuring analytics table exists:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Garantir que a tabela existe
    await ensureAnalyticsTableExists()

    const url = new URL(request.url)
    const searchParams = url.searchParams
    const days = Number.parseInt(searchParams.get("days") || "7")

    // Verificar se há dados na tabela
    const hasData = await sql`SELECT COUNT(*) as count FROM analytics_events`

    if (Number.parseInt(hasData[0].count) === 0) {
      // Se não há dados, retornar estrutura vazia
      return NextResponse.json({
        success: true,
        data: {
          events: [],
          stats: {
            unique_sessions: 0,
            total_events: 0,
            page_views: 0,
            form_submissions: 0,
            property_views: 0,
          },
          topEvents: [],
          period: `${days} days`,
        },
      })
    }

    const events = await sql`
      SELECT 
        event_type,
        DATE(created_at) as date,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event_type, DATE(created_at) 
      ORDER BY date DESC
    `

    // Estatísticas gerais
    const stats = await sql`
      SELECT 
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(*) as total_events,
        COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as page_views,
        COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END) as form_submissions,
        COUNT(CASE WHEN event_type = 'property_view' THEN 1 END) as property_views
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
    `

    // Top eventos
    const topEvents = await sql`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event_type
      ORDER BY count DESC
      LIMIT 10
    `

    return NextResponse.json({
      success: true,
      data: {
        events,
        stats: stats[0] || {
          unique_sessions: 0,
          total_events: 0,
          page_views: 0,
          form_submissions: 0,
          property_views: 0,
        },
        topEvents,
        period: `${days} days`,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)

    // Em caso de erro, retornar dados vazios
    return NextResponse.json({
      success: true,
      data: {
        events: [],
        stats: {
          unique_sessions: 0,
          total_events: 0,
          page_views: 0,
          form_submissions: 0,
          property_views: 0,
        },
        topEvents: [],
        period: "7 days",
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Garantir que a tabela existe
    await ensureAnalyticsTableExists()

    const body = await request.json()
    const { session_id, event_type, event_data } = body

    if (!session_id || !event_type) {
      return NextResponse.json({ success: false, error: "Session ID and event type are required" }, { status: 400 })
    }

    // Capturar informações da requisição
    const userAgent = request.headers.get("user-agent") || ""
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "127.0.0.1"

    const result = await sql`
      INSERT INTO analytics_events (session_id, event_type, event_data, user_agent, ip_address)
      VALUES (${session_id}, ${event_type}, ${JSON.stringify(event_data)}, ${userAgent}, ${ipAddress})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Event tracked successfully",
    })
  } catch (error) {
    console.error("Error tracking event:", error)
    return NextResponse.json({ success: false, error: "Failed to track event" }, { status: 500 })
  }
}
