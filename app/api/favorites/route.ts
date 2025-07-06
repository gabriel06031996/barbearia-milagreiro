import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("user_email")

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "User email is required" }, { status: 400 })
    }

    const favorites = await sql`
      SELECT 
        f.*,
        p.title,
        p.price,
        p.property_type,
        p.transaction_type,
        p.neighborhood,
        p.city,
        p.images
      FROM favorites f
      JOIN properties p ON f.property_id = p.id
      WHERE f.user_email = ${userEmail}
      AND p.is_active = true
      ORDER BY f.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_email, property_id } = body

    if (!user_email || !property_id) {
      return NextResponse.json({ success: false, error: "User email and property ID are required" }, { status: 400 })
    }

    // Verificar se a propriedade existe
    const property = await sql`
      SELECT id FROM properties WHERE id = ${property_id} AND is_active = true
    `

    if (property.length === 0) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    const result = await sql`
      INSERT INTO favorites (user_email, property_id)
      VALUES (${user_email}, ${property_id})
      ON CONFLICT (user_email, property_id) DO NOTHING
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0] || { user_email, property_id },
      message: "Property added to favorites",
    })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ success: false, error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("user_email")
    const propertyId = searchParams.get("property_id")

    if (!userEmail || !propertyId) {
      return NextResponse.json({ success: false, error: "User email and property ID are required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM favorites 
      WHERE user_email = ${userEmail} AND property_id = ${Number.parseInt(propertyId)}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Property removed from favorites",
    })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ success: false, error: "Failed to remove favorite" }, { status: 500 })
  }
}
