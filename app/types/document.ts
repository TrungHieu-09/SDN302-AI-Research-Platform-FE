export type DocumentStatus = "published" | "draft" | "archived"
export type FileType = "pdf" | "docx" | "pptx" | "txt"

export interface DocumentTag {
  id: string
  name: string
  color: string
}

export interface DocumentItem {
  id: string
  title: string
  authors: string[]
  year: number
  collection: string
  fileType: FileType
  tags: DocumentTag[]
  status: DocumentStatus
  addedAt: string
}

export interface Collection {
  id: string
  name: string
  count: number
  children?: Collection[]
}
