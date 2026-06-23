"use client"

import { Folder, Plus } from "lucide-react"

import type { Collection } from "@/app/types/document"

interface CollectionsSidebarProps {
  collections: Collection[]
  activeId: string
  onSelect: (id: string) => void
}

function CollectionRow({
  collection,
  activeId,
  onSelect,
  depth,
}: {
  collection: Collection
  activeId: string
  onSelect: (id: string) => void
  depth: number
}) {
  const isActive = collection.id === activeId

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(collection.id)}
        className={`flex w-full items-center gap-2 rounded-full px-3 py-2.5 text-left text-[14px] transition-colors ${
          isActive
            ? "bg-[#0058be] font-semibold text-white shadow-[0_10px_24px_rgba(0,88,190,0.14)]"
            : "text-[#424753] hover:bg-[#eff4ff] hover:text-[#121c2a]"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <Folder size={16} className={isActive ? "text-white" : "text-[#727784]"} />
        <span className="min-w-0 flex-1 truncate">{collection.name}</span>
        <span className={`text-[12px] font-medium ${isActive ? "text-[#d8e2ff]" : "text-[#727784]"}`}>
          {collection.count}
        </span>
      </button>
      {collection.children?.map((child) => (
        <CollectionRow
          key={child.id}
          collection={child}
          activeId={activeId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export function CollectionsSidebar({ collections, activeId, onSelect }: CollectionsSidebarProps) {
  return (
    <aside className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase text-[#727784]">Collections</h3>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#727784] transition-colors hover:bg-[#eff4ff] hover:text-[#0058be]"
          aria-label="Add collection"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-1">
        {collections.map((collection) => (
          <CollectionRow
            key={collection.id}
            collection={collection}
            activeId={activeId}
            onSelect={onSelect}
            depth={0}
          />
        ))}
      </div>
    </aside>
  )
}
