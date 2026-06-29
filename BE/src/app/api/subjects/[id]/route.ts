import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { UpdateSubjectSchema } from "@/lib/validation/subject"

// GET /api/subjects/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const subject = await db.subject.findUnique({ where: { id: params.id } })
  if (!subject) return NextResponse.json({ error: "Subject not found." }, { status: 404 })
  return NextResponse.json(subject)
}

// PUT /api/subjects/[id] — Admin only
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const parsed = UpdateSubjectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const subject = await db.subject.update({ where: { id: params.id }, data: parsed.data })
    return NextResponse.json(subject)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

// DELETE /api/subjects/[id] — Admin only (sets status to SUSPENDED)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subject = await db.subject.update({
      where: { id: params.id },
      data: { status: "SUSPENDED" },
    })
    return NextResponse.json({ message: "Subject deactivated.", subject })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
