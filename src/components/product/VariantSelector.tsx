'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { ProductVariant } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedId?: string
  onChange?: (id: string) => void
}

export function VariantSelector({
  variants,
  selectedId,
  onChange,
}: VariantSelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = variants.find(v => v.id === selectedId) ?? variants[0]

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  if (!variants.length) return null

  // Pills for 4 or fewer
  if (variants.length <= 4) {
    return (
      <div className="flex flex-wrap gap-2">
        {variants.map(variant => {
          const isSelected = variant.id === selectedId
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onChange?.(variant.id)}
              className={`rounded-lg border px-4 py-2 text-xs font-medium
                transition-all duration-150
                ${isSelected
                  ? 'border-[#FF6B35] bg-[#FFF3EE] text-[#FF6B35] shadow-[0_0_0_1px_#FF6B35]'
                  : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#FF6B35] hover:text-[#FF6B35]'
                }`}
            >
              {variant.name ?? 'Default'}
            </button>
          )
        })}
      </div>
    )
  }

  // Custom dropdown for 5+
  return (
    <div ref={containerRef} className="relative w-full">

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-3
          rounded-xl border px-4 py-3 text-sm font-medium
          transition-all duration-150 bg-white
          ${open
            ? 'border-[#FF6B35] shadow-[0_0_0_1px_#FF6B35] text-[#FF6B35]'
            : 'border-[#E5E7EB] text-[#111827] hover:border-[#FF6B35]'
          }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Color swatch if name contains a color keyword */}
          <ColorDot name={selected?.name ?? ''} />
          <span className="truncate">{selected?.name ?? 'Select variant'}</span>
        </div>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-200
            ${open ? 'rotate-180 text-[#FF6B35]' : 'text-[#9CA3AF]'}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50
            bg-white border border-[#E5E7EB] rounded-xl overflow-hidden
            shadow-lg shadow-black/5"
          style={{ maxHeight: 260, overflowY: 'auto' }}
        >
          {/* Search bar for 8+ variants */}
          {variants.length >= 8 && (
            <VariantSearch
              variants={variants}
              selectedId={selectedId}
              onSelect={id => {
                onChange?.(id)
                setOpen(false)
              }}
            />
          )}

          {/* Standard list for < 8 */}
          {variants.length < 8 && (
            <ul className="py-1">
              {variants.map((variant, i) => {
                const isSelected = variant.id === selectedId
                return (
                  <li key={variant.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange?.(variant.id)
                        setOpen(false)
                      }}
                      className={`w-full flex items-center justify-between
                        px-4 py-2.5 text-sm transition-colors text-left
                        ${isSelected
                          ? 'bg-[#FFF3EE] text-[#FF6B35]'
                          : 'text-[#374151] hover:bg-[#F8F7F4]'
                        }
                        ${i !== 0 ? 'border-t border-[#F3F4F6]' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ColorDot name={variant.name ?? ''} />
                        <span className="truncate">{variant.name ?? 'Default'}</span>
                      </div>
                      {isSelected && (
                        <Check size={14} className="flex-shrink-0 text-[#FF6B35]" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// Searchable list for large variant sets
function VariantSearch({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = variants.filter(v =>
    (v.name ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      {/* Search input */}
      <div className="px-3 pt-3 pb-2 border-b border-[#F3F4F6]">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search variants..."
          className="w-full bg-[#F8F7F4] border border-[#E5E7EB] rounded-lg
            px-3 py-2 text-sm text-[#111827] placeholder-[#9CA3AF]
            outline-none focus:border-[#FF6B35] transition-colors"
        />
      </div>

      {/* Results */}
      <ul className="py-1">
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-[#9CA3AF] text-center">
            No variants match "{query}"
          </li>
        ) : (
          filtered.map((variant, i) => {
            const isSelected = variant.id === selectedId
            return (
              <li key={variant.id}>
                <button
                  type="button"
                  onClick={() => onSelect(variant.id)}
                  className={`w-full flex items-center justify-between
                    px-4 py-2.5 text-sm transition-colors text-left
                    ${isSelected
                      ? 'bg-[#FFF3EE] text-[#FF6B35]'
                      : 'text-[#374151] hover:bg-[#F8F7F4]'
                    }
                    ${i !== 0 ? 'border-t border-[#F3F4F6]' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ColorDot name={variant.name ?? ''} />
                    <span className="truncate">{variant.name ?? 'Default'}</span>
                  </div>
                  {isSelected && (
                    <Check size={14} className="flex-shrink-0 text-[#FF6B35]" />
                  )}
                </button>
              </li>
            )
          })
        )}
      </ul>

      {/* Count */}
      {query && (
        <div className="px-4 py-2 border-t border-[#F3F4F6]">
          <p className="text-xs text-[#9CA3AF]">
            {filtered.length} of {variants.length} variants
          </p>
        </div>
      )}
    </div>
  )
}

// Shows a color dot if the variant name contains a recognizable color
const COLOR_MAP: Record<string, string> = {
  black: '#111827',
  white: '#F9FAFB',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  orange: '#FF6B35',
  pink: '#EC4899',
  purple: '#8B5CF6',
  gray: '#6B7280',
  grey: '#6B7280',
  brown: '#92400E',
  gold: '#D97706',
  silver: '#9CA3AF',
  navy: '#1E3A5F',
  beige: '#D2B48C',
}

function ColorDot({ name }: { name: string }) {
  const lower = name.toLowerCase()
  const match = Object.keys(COLOR_MAP).find(color => lower.includes(color))
  if (!match) return null

  return (
    <span
      className="flex-shrink-0 w-3 h-3 rounded-full border border-[#E5E7EB]"
      style={{ backgroundColor: COLOR_MAP[match] }}
    />
  )
}

export default VariantSelector