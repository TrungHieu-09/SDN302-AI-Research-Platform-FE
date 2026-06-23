"use client"

import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Folder,
  MoreVertical,
} from "lucide-react"

import type { DocumentItem, FileType } from "@/app/types/document"

interface DocumentTableProps {
  documents: DocumentItem[]
  selectedId?: string
  onSelect?: (doc: DocumentItem) => void
  onPreview?: (doc: DocumentItem) => void
  onAskAI?: (doc: DocumentItem) => void
}

const fileTypeStyles: Record<FileType, { label: string; iconColor: string; bgColor: string }> = {
  pdf: {
    label: "PDF",
    iconColor: "#ba1a1a",
    bgColor: "#fde8e8",
  },
  docx: {
    label: "DOCX",
    iconColor: "#0058be",
    bgColor: "#e8f0ff",
  },
  pptx: {
    label: "PPTX",
    iconColor: "#924700",
    bgColor: "#fff0df",
  },
  txt: {
    label: "TXT",
    iconColor: "#727785",
    bgColor: "#eef0f4",
  },
}

export function DocumentTable({ documents, selectedId, onSelect, onPreview, onAskAI }: DocumentTableProps) {
  const visibleCount = documents.length

  return (
    <div className="overflow-hidden">
      <div className="max-h-[calc(100vh-310px)] min-h-[460px] overflow-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#c2c6d6]/20">
              <th className="w-12 px-5 py-4">
                <input
                  type="checkbox"
                  aria-label="Select all documents"
                  className="h-4 w-4 rounded border-[#c2c6d6] accent-[#0058be]"
                />
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#424754]">Title & Authors</th>
              <th className="w-24 px-5 py-4 text-xs font-semibold uppercase text-[#424754]">Year</th>
              <th className="w-48 px-5 py-4 text-xs font-semibold uppercase text-[#424754]">Collection</th>
              <th className="w-48 px-5 py-4 text-xs font-semibold uppercase text-[#424754]">Tags</th>
              <th className="w-36 px-5 py-4 text-right text-xs font-semibold uppercase text-[#424754]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {documents.map((document) => {
              const fileStyle = fileTypeStyles[document.fileType]
              const isSelected = document.id === selectedId

              return (
                <tr
                  key={document.id}
                  onClick={() => onSelect?.(document)}
                  className={`group cursor-pointer border-b border-[#c2c6d6]/20 transition-colors last:border-b-0 ${
                    isSelected ? "bg-[#eff4ff]" : "hover:bg-[#0058be]/5"
                  }`}
                >
                  <td className="px-5 py-4 align-middle">
                    <input
                      type="checkbox"
                      aria-label={`Select ${document.title}`}
                      className="h-4 w-4 rounded border-[#c2c6d6] accent-[#0058be]"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: fileStyle.bgColor, color: fileStyle.iconColor }}
                      >
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[14px] font-semibold text-[#121c2a]">{document.title}</p>
                          <span className="rounded bg-[#eff4ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#727784]">
                            {fileStyle.label}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[12px] text-[#727784]">
                          {document.authors.join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[14px] font-medium text-[#424754]">{document.year}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#eff4ff] px-3 py-1.5 text-[12px] font-medium text-[#424753]">
                      <Folder size={13} className="shrink-0 text-[#727784]" />
                      <span className="truncate">{document.collection}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8f9ff] px-2.5 py-1 text-[12px] font-medium text-[#424753]"
                          title={tag.name}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onAskAI?.(document)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#0058be] transition-colors hover:bg-[#0058be] hover:text-white"
                        aria-label={`Ask AI about ${document.title}`}
                        title="Ask AI"
                      >
                        <Brain size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onPreview?.(document)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#424754] transition-colors hover:bg-[#f1f5f9] hover:text-[#0058be]"
                        aria-label={`Preview ${document.title}`}
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#424754] transition-colors hover:bg-[#f1f5f9] hover:text-[#0058be]"
                        aria-label={`More actions for ${document.title}`}
                        title="More"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-[14px] font-semibold text-[#121c2a]">No documents found</p>
                  <p className="mt-1 text-[13px] text-[#727784]">Try a different title or author.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#c2c6d6]/20 bg-[#f8f9ff] px-5 py-4 text-[13px] text-[#424753] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {visibleCount > 0 ? 1 : 0} to {visibleCount} of {visibleCount} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c2c6d6]/40 text-[#727785] transition-colors hover:bg-[#f8f9ff] hover:text-[#0058be]"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#0058be] px-3 text-[13px] font-semibold text-white"
          >
            1
          </button>
          <button
            type="button"
            className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[#c2c6d6]/40 px-3 text-[13px] font-semibold text-[#424754] transition-colors hover:bg-[#f8f9ff] hover:text-[#0058be]"
          >
            2
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c2c6d6]/40 text-[#727785] transition-colors hover:bg-[#f8f9ff] hover:text-[#0058be]"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
