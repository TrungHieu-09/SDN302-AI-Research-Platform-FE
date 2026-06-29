import { NextRequest, NextResponse } from "next/server"
import { getDocumentAuditLogs } from "@/lib/services/doc-service"

// GET /api/documents/[id]/audit
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const logs = await getDocumentAuditLogs(params.id)
    return NextResponse.json(logs)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
