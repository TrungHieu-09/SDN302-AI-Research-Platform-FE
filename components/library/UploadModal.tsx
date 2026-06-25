"use client"

import * as React from "react"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"

import type { Collection, DocumentItem, FileType } from "@/app/types/document"
import { uploadDocument } from "@/lib/upload-service"

interface UploadModalProps {
  open: boolean
  onClose: () => void
  collections: Collection[]
  onUploadComplete: (doc: DocumentItem) => void
}

type UploadStatus = "idle" | "selected" | "uploading" | "success" | "error"

const acceptedExtensions: FileType[] = ["pdf", "docx", "pptx", "txt"]

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

function flattenCollections(collections: Collection[]): Collection[] {
  return collections.flatMap((collection) => [
    collection,
    ...(collection.children ? flattenCollections(collection.children) : []),
  ])
}

function getFileType(fileName: string): FileType {
  const extension = fileName.split(".").pop()?.toLowerCase()

  if (acceptedExtensions.includes(extension as FileType)) {
    return extension as FileType
  }

  return "pdf"
}

function isAcceptedFile(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase()
  return acceptedExtensions.includes(extension as FileType)
}

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadModal({ open, onClose, collections, onUploadComplete }: UploadModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const uploadRunRef = React.useRef(0)
  const openRef = React.useRef(open)
  const collectionOptions = React.useMemo(() => flattenCollections(collections), [collections])
  const defaultCollection = collectionOptions[0]?.name ?? "All Documents"

  const [status, setStatus] = React.useState<UploadStatus>("idle")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [selectedCollection, setSelectedCollection] = React.useState(defaultCollection)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [dragActive, setDragActive] = React.useState(false)

  const resetState = React.useCallback(() => {
    uploadRunRef.current += 1
    setStatus("idle")
    setSelectedFile(null)
    setSelectedCollection(defaultCollection)
    setErrorMessage("")
    setDragActive(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [defaultCollection])

  React.useEffect(() => {
    openRef.current = open

    if (!open) {
      resetState()
    }
  }, [open, resetState])

  const handleClose = React.useCallback(() => {
    resetState()
    onClose()
  }, [onClose, resetState])

  const handleSelectFile = React.useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setSelectedFile(null)
      setStatus("error")
      setErrorMessage("Please choose a PDF, DOCX, PPTX, or TXT file.")
      return
    }

    setSelectedFile(file)
    setStatus("selected")
    setErrorMessage("")
  }, [])

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      handleSelectFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)

    const file = event.dataTransfer.files[0]

    if (file) {
      handleSelectFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || status === "uploading") {
      return
    }

    const uploadRun = uploadRunRef.current + 1
    uploadRunRef.current = uploadRun
    setStatus("uploading")
    setErrorMessage("")

    try {
      const result = await uploadDocument(selectedFile, {
        collection: selectedCollection,
        tags: [],
      })

      if (uploadRunRef.current !== uploadRun || !openRef.current) {
        return
      }

      if (!result.success || !result.document) {
        setStatus("error")
        setErrorMessage(result.error ?? "Upload failed. Please try again.")
        return
      }

      setStatus("success")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (uploadRunRef.current === uploadRun && openRef.current) {
        onUploadComplete(result.document)
        resetState()
      }
    } catch {
      if (uploadRunRef.current === uploadRun && openRef.current) {
        setStatus("error")
        setErrorMessage("Upload failed. Please try again.")
      }
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleUpload()
  }

  if (!open) {
    return null
  }

  const fileType = selectedFile ? getFileType(selectedFile.name) : "pdf"
  const fileStyle = fileTypeStyles[fileType]
  const canUpload = Boolean(selectedFile) && status !== "uploading" && status !== "success"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md min-w-0 rounded-2xl bg-white p-6 shadow-xl sm:w-[28rem]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-document-title"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="upload-document-title" className="text-[20px] font-semibold text-[#121c2a]">
            Upload Document
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#727785] transition-colors hover:bg-[#eff4ff] hover:text-[#0058be]"
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {status === "idle" || (!selectedFile && status === "error") ? (
            <div
              className={`flex w-full min-w-0 cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragActive ? "border-[#0058be] bg-[#eff4ff]" : "border-[#c2c6d6] bg-white"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <UploadCloud size={44} className="mb-4 text-[#727785]" />
              <p className="w-full text-[14px] font-semibold text-[#121c2a]">
                Drag & drop file here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                name="document"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Choose document file"
              />
            </div>
          ) : null}

          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#c2c6d6]/50 bg-[#f8f9ff] p-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: fileStyle.bgColor, color: fileStyle.iconColor }}
                >
                  <FileText size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14px] font-semibold text-[#121c2a]">{selectedFile.name}</p>
                    <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#727785]">
                      {fileStyle.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#727785]">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setStatus("idle")
                    setErrorMessage("")

                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#727785] transition-colors hover:bg-white hover:text-[#0058be]"
                  aria-label="Remove selected file"
                >
                  <X size={16} />
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-[#424754]">Collection</span>
                <select
                  name="collection"
                  value={selectedCollection}
                  onChange={(event) => setSelectedCollection(event.target.value)}
                  disabled={status === "uploading" || status === "success"}
                  className="h-11 w-full rounded-xl border border-[#c2c6d6] bg-white px-3 text-[14px] font-medium text-[#121c2a] outline-none transition-colors focus:border-[#0058be] disabled:cursor-not-allowed disabled:bg-[#f8f9ff] disabled:text-[#727785]"
                >
                  {collectionOptions.map((collection) => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {status === "uploading" ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#eff4ff] px-4 py-3 text-[14px] font-semibold text-[#0058be]">
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </div>
          ) : null}

          {status === "success" ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#edf8ef] px-4 py-3 text-[14px] font-semibold text-[#1f8a3b]">
              <CheckCircle2 size={18} />
              Upload successful!
            </div>
          ) : null}

          {status === "error" && errorMessage ? (
            <div className="mt-4 rounded-xl border border-[#ba1a1a]/20 bg-[#fff1f1] px-4 py-3">
              <div className="flex items-start gap-2 text-[14px] font-semibold text-[#ba1a1a]">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={selectedFile ? handleUpload : resetState}
                className="mt-3 h-9 rounded-lg border border-[#ba1a1a]/25 px-3 text-[13px] font-semibold text-[#ba1a1a] transition-colors hover:bg-white"
              >
                Try Again
              </button>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 rounded-xl border border-[#c2c6d6] bg-white px-4 text-[14px] font-semibold text-[#424754] transition-colors hover:border-[#0058be]/30 hover:text-[#0058be]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canUpload}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#004191] to-[#0051d6] px-5 text-[14px] font-semibold text-white shadow-[0px_4px_14px_rgba(0,65,145,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "uploading" ? <Loader2 size={17} className="animate-spin" /> : null}
              {status === "uploading" ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
