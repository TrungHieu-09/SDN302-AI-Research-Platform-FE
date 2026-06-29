import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { SubjectSuggestionSchema, ReviewSuggestionSchema } from "@/lib/validation/subject"

// POST /api/subjects/suggest — Student proposes a new subject tag
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!
    const body = await req.json()
    const parsed = SubjectSuggestionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const suggestion = await db.subjectSuggestion.create({
      data: { name: parsed.data.name, proposedById: userId },
    })

    return NextResponse.json(suggestion, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

// GET /api/subjects/suggest — Moderator/Admin views pending suggestions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = (searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED") ?? "PENDING"

    const suggestions = await db.subjectSuggestion.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: { proposedBy: { select: { id: true, name: true, email: true } } },
    })

    return NextResponse.json(suggestions)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
