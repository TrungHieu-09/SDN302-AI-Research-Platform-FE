"use client"

import { Plus } from "lucide-react"

import type { DocumentTag } from "@/app/types/document"

interface TagsPanelProps {
  tags: DocumentTag[]
}

function hexToRgba(hex: string, alpha: number) {
  const normalizedHex = hex.replace("#", "")
  const numericValue = Number.parseInt(normalizedHex, 16)
  const red = (numericValue >> 16) & 255
  const green = (numericValue >> 8) & 255
  const blue = numericValue & 255

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function TagsPanel({ tags }: TagsPanelProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase text-[#727784]">Tags</h3>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#727784] transition-colors hover:bg-[#eff4ff] hover:text-[#0058be]"
          aria-label="Add tag"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-lg px-2.5 py-1.5 text-[12px] font-semibold"
            style={{
              backgroundColor: hexToRgba(tag.color, 0.1),
              color: tag.color,
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </section>
  )
}
