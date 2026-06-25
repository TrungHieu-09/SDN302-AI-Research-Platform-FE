import type { DocumentItem, FileType } from "@/app/types/document"

export interface UploadResult {
  success: boolean
  document?: DocumentItem
  error?: string
}

interface UploadMetadata {
  collection: string
  tags: string[]
}

export async function uploadDocument(file: File, metadata: UploadMetadata): Promise<UploadResult> {
  // TODO: Replace with a real API call later, for example:
  // const formData = new FormData()
  // formData.append("file", file)
  // const res = await fetch("/api/documents/upload", { method: "POST", body: formData })
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const fileExt = file.name.split(".").pop()?.toLowerCase()
  const fileType = (["pdf", "docx", "pptx", "txt"].includes(fileExt || "") ? fileExt : "pdf") as FileType

  return {
    success: true,
    document: {
      id: `doc-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      authors: ["You"],
      year: new Date().getFullYear(),
      collection: metadata.collection || "All Documents",
      fileType,
      tags: [],
      status: "published",
      addedAt: new Date().toISOString(),
    },
  }
}
