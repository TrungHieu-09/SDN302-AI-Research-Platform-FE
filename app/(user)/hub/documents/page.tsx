"use client"

import * as React from "react"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Copy,
  FileText,
  Hash,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react"

import { mockCollections, mockDocumentList, mockTags } from "@/app/mock/library"
import type { DocumentItem } from "@/app/types/document"
import { CollectionsSidebar } from "@/components/library/CollectionsSidebar"
import { DocumentTable } from "@/components/library/DocumentTable"
import { TagsPanel } from "@/components/library/TagsPanel"

export default function DocumentsPage() {
  const [activeCollectionId, setActiveCollectionId] = React.useState("all-documents")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDocumentId, setSelectedDocumentId] = React.useState(mockDocumentList[0]?.id ?? "")

  const filteredDocuments = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return mockDocumentList
    }

    return mockDocumentList.filter((document) => {
      const titleMatches = document.title.toLowerCase().includes(normalizedQuery)
      const authorMatches = document.authors.some((author) => author.toLowerCase().includes(normalizedQuery))

      return titleMatches || authorMatches
    })
  }, [searchQuery])

  const handleDocumentAction = React.useCallback((document: DocumentItem) => {
    setSelectedDocumentId(document.id)
    return document.id
  }, [])

  const selectedDocument = React.useMemo(() => {
    return mockDocumentList.find((document) => document.id === selectedDocumentId) ?? filteredDocuments[0]
  }, [filteredDocuments, selectedDocumentId])

  React.useEffect(() => {
    if (filteredDocuments.length === 0) {
      return
    }

    const selectedDocumentIsVisible = filteredDocuments.some((document) => document.id === selectedDocumentId)

    if (!selectedDocumentIsVisible) {
      setSelectedDocumentId(filteredDocuments[0].id)
    }
  }, [filteredDocuments, selectedDocumentId])

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] px-4 py-4 pb-20 md:px-8 md:py-6 xl:px-12">
      <div className="mb-6 overflow-hidden rounded-[32px] border border-[#c2c6d6]/30 bg-[#f8f9ff]/80 p-4 shadow-[0_10px_40px_rgba(31,41,55,0.08)] backdrop-blur-[20px] md:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eff4ff] px-3 py-1.5 text-[12px] font-semibold uppercase text-[#0058be]">
              <Sparkles size={13} />
              AI Research Library
            </div>
            <h2 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#121c2a] md:text-[32px]">
              Library
            </h2>
            <p className="mt-1 text-[14px] leading-[1.5] text-[#424753]">
              Browse, organize, and query your research documents with Lumis AI context.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:w-[360px]">
            <div className="rounded-2xl border border-[#c2c6d6]/30 bg-white/70 px-3 py-3 backdrop-blur-[12px]">
              <p className="text-[20px] font-bold text-[#004191]">142</p>
              <p className="mt-1 text-[11px] font-medium uppercase text-[#727784]">Docs</p>
            </div>
            <div className="rounded-2xl border border-[#c2c6d6]/30 bg-white/70 px-3 py-3 backdrop-blur-[12px]">
              <p className="text-[20px] font-bold text-[#004191]">14</p>
              <p className="mt-1 text-[11px] font-medium uppercase text-[#727784]">Collections</p>
            </div>
            <div className="rounded-2xl border border-[#c2c6d6]/30 bg-white/70 px-3 py-3 backdrop-blur-[12px]">
              <p className="text-[20px] font-bold text-[#004191]">62</p>
              <p className="mt-1 text-[11px] font-medium uppercase text-[#727784]">Tags</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-[#c2c6d6]/50 bg-white/90 px-4 py-3 shadow-[0_2px_12px_rgba(31,41,55,0.04)] backdrop-blur-[20px] transition-all focus-within:border-[#0058be]/40 focus-within:shadow-[0_0_0_4px_rgba(0,88,190,0.08)] lg:max-w-[560px]">
            <Search size={18} className="shrink-0 text-[#727784]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search documents..."
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#121c2a] outline-none placeholder:text-[#727784]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex h-12 items-center gap-2 rounded-2xl border border-[#c2c6d6]/50 bg-white/90 px-4 text-[14px] font-semibold text-[#424753] backdrop-blur-[20px] transition-colors hover:border-[#0058be]/30 hover:text-[#0058be]"
            >
              Sort: Date Added
              <ChevronDown size={16} className="text-[#727784]" />
            </button>

            <div className="flex h-12 overflow-hidden rounded-2xl border border-[#c2c6d6]/50 bg-white/90 backdrop-blur-[20px]">
              <button
                type="button"
                className="flex w-11 items-center justify-center bg-[#eff4ff] text-[#0058be]"
                aria-label="List view"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                className="flex w-11 items-center justify-center text-[#727784] transition-colors hover:bg-[#f8f9ff] hover:text-[#0058be]"
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <button
              type="button"
              className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#004191] to-[#0051d6] px-5 text-[14px] font-semibold text-white shadow-[0px_4px_14px_rgba(0,65,145,0.25)] transition-opacity hover:opacity-90"
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <div className="rounded-[32px] border border-[#c2c6d6]/30 bg-white/70 p-5 shadow-[0_10px_40px_rgba(31,41,55,0.06)] backdrop-blur-[12px]">
          <CollectionsSidebar
            collections={mockCollections}
            activeId={activeCollectionId}
            onSelect={setActiveCollectionId}
          />
          <div className="my-5 border-t border-[#c2c6d6]/20" />
          <TagsPanel tags={mockTags} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-[32px] border border-[#c2c6d6]/30 bg-white shadow-[0_10px_40px_rgba(31,41,55,0.08)]">
          <div className="flex items-center justify-between border-b border-[#c2c6d6]/20 bg-white px-6 py-5">
            <div>
              <h3 className="text-[18px] font-semibold text-[#121c2a]">Document Index</h3>
              <p className="mt-1 text-[13px] text-[#727784]">
                {filteredDocuments.length} matching documents in the current workspace.
              </p>
            </div>
            <div className="hidden rounded-full border border-[#0058be]/15 bg-[#eff4ff] px-3 py-1.5 text-[12px] font-semibold text-[#0058be] sm:block">
              AI-ready
            </div>
          </div>
          <DocumentTable
            documents={filteredDocuments}
            selectedId={selectedDocument?.id}
            onSelect={(document) => setSelectedDocumentId(document.id)}
            onPreview={handleDocumentAction}
            onAskAI={handleDocumentAction}
          />
        </div>

        <aside className="hidden overflow-hidden rounded-[32px] border border-[#c2c6d6]/30 bg-white/78 shadow-[0_10px_40px_rgba(31,41,55,0.08)] backdrop-blur-[12px] xl:block">
          <div className="flex items-start justify-between border-b border-[#c2c6d6]/20 bg-[#f8f9ff]/80 px-6 py-5 backdrop-blur-[20px]">
            <div>
              <p className="text-[12px] font-semibold uppercase text-[#0058be]">Inspector</p>
              <h3 className="mt-1 text-[18px] font-semibold text-[#121c2a]">Document Details</h3>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#727784] transition-colors hover:bg-[#eff4ff] hover:text-[#0058be]"
              aria-label="Close inspector"
            >
              <X size={16} />
            </button>
          </div>

          {selectedDocument ? (
            <div className="max-h-[calc(100vh-245px)] overflow-y-auto p-6">
              <div className="mb-5 rounded-3xl border border-[#0058be]/20 bg-gradient-to-br from-[#0058be] to-[#316bf3] p-5 text-white shadow-[0_10px_30px_rgba(0,88,190,0.18)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <FileText size={24} />
                </div>
                <h4 className="text-[18px] font-semibold leading-snug">{selectedDocument.title}</h4>
                <p className="mt-2 text-[13px] leading-[1.5] text-[#fefcff]/80">
                  {selectedDocument.authors.join(", ")}
                </p>
              </div>

              <div className="space-y-5">
                <section>
                  <h4 className="mb-3 text-[12px] font-semibold uppercase text-[#727784]">Metadata</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#eff4ff] p-3">
                      <Calendar size={15} className="mb-2 text-[#0058be]" />
                      <p className="text-[11px] font-medium uppercase text-[#727784]">Year</p>
                      <p className="mt-1 text-[14px] font-semibold text-[#121c2a]">{selectedDocument.year}</p>
                    </div>
                    <div className="rounded-2xl bg-[#eff4ff] p-3">
                      <Hash size={15} className="mb-2 text-[#0058be]" />
                      <p className="text-[11px] font-medium uppercase text-[#727784]">Status</p>
                      <p className="mt-1 text-[14px] font-semibold capitalize text-[#121c2a]">
                        {selectedDocument.status}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#eff4ff] p-3">
                      <BookOpen size={15} className="mb-2 text-[#0058be]" />
                      <p className="text-[11px] font-medium uppercase text-[#727784]">Collection</p>
                      <p className="mt-1 text-[14px] font-semibold text-[#121c2a]">{selectedDocument.collection}</p>
                    </div>
                    <div className="rounded-2xl bg-[#eff4ff] p-3">
                      <Users size={15} className="mb-2 text-[#0058be]" />
                      <p className="text-[11px] font-medium uppercase text-[#727784]">Authors</p>
                      <p className="mt-1 text-[14px] font-semibold text-[#121c2a]">
                        {selectedDocument.authors.length}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-[12px] font-semibold uppercase text-[#727784]">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-lg bg-[#d9e3f7] px-2.5 py-1.5 text-[12px] font-semibold text-[#424753]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-[12px] font-semibold uppercase text-[#727784]">Abstract</h4>
                  <p className="rounded-3xl border border-[#c2c6d6]/30 bg-[#f8f9ff] p-4 text-[14px] leading-[1.6] text-[#424753]">
                    Lumis has marked this document as a high-signal reference for synthesis workflows. Use Ask AI to
                    extract claims, compare methods, and generate literature review notes.
                  </p>
                </section>

                <section className="rounded-3xl border border-[#0058be]/20 bg-[#eff4ff] p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#0058be]">
                    <Sparkles size={16} />
                    <h4 className="text-[13px] font-semibold uppercase">Citation Generator</h4>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-[#424753]">
                    {selectedDocument.authors[0]} et al. ({selectedDocument.year}). {selectedDocument.title}.
                  </p>
                  <button
                    type="button"
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#0058be] text-[13px] font-semibold text-white transition-colors hover:bg-[#2170e4]"
                  >
                    <Copy size={15} />
                    Copy Citation
                  </button>
                </section>
              </div>
            </div>
          ) : (
            <div className="p-6 text-[14px] text-[#727784]">Select a document to inspect metadata.</div>
          )}
        </aside>
      </div>
    </div>
  )
}
