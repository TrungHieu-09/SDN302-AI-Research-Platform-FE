import { NextRequest, NextResponse } from "next/server"
import { ModerationDecisionSchema } from "@/lib/validation/doc"
import { moderateDocument } from "@/lib/services/doc-service"

// POST /api/documents/[id]/moderate  — Moderator / Admin only (enforced by middleware)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const moderatorId = req.headers.get("x-user-id")!
    const ipAddress = req.headers.get("x-forwarded-for") ?? req.ip
    const body = await req.json()
    const parsed = ModerationDecisionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const doc = await moderateDocument(params.id, moderatorId, parsed.data, ipAddress ?? undefined)
    return NextResponse.json(doc)
  } catch (err: any) {
    const status = err.message === "Document not found." ? 404 : 400
    return NextResponse.json({ error: err.message }, { status })
  }
}
