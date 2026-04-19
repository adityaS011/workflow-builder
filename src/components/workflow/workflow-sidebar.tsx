'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { NODE_TEMPLATES, SIDEBAR_CATEGORIES, type SidebarNodeTemplate } from './node-templates'

interface WorkflowSidebarProps {
  onAddNode: (type: string, label: string) => void
}

function NodeCard({ template, onAdd }: { template: SidebarNodeTemplate; onAdd: () => void }) {
  const Icon = template.Icon
  return (
    <button onClick={onAdd} className="w-full text-left p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary hover:border-border/80 transition-all group">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 ${template.accent} ${template.color}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold text-foreground">{template.name}</span>
        <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug pl-8">{template.description}</p>
    </button>
  )
}

export function WorkflowSidebar({ onAddNode }: WorkflowSidebarProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [collapsed, setCollapsed] = useState(false)

  const filtered = NODE_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || t.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className={`${collapsed ? 'w-10' : 'w-64'} bg-card border-r border-border h-full flex flex-col transition-all duration-200 flex-shrink-0`}>
      <div className="flex items-center justify-between px-3 h-12 border-b border-border flex-shrink-0">
        {!collapsed && <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nodes</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
              <Input placeholder="Search nodes…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs bg-secondary border-border" />
            </div>
          </div>

          <div className="px-3 py-2 flex flex-wrap gap-1 border-b border-border">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map((t) => (
              <NodeCard key={t.type} template={t} onAdd={() => onAddNode(t.type, t.name)} />
            ))}
            {filtered.length === 0 && <p className="text-center py-8 text-xs text-muted-foreground">No nodes found</p>}
          </div>

          <div className="px-3 py-2.5 border-t border-border bg-secondary/20">
            <p className="text-xs text-muted-foreground">Click a node to add it to the canvas</p>
          </div>
        </>
      )}

      {collapsed && (
        <div className="flex-1 flex flex-col items-center pt-3 gap-2">
          {NODE_TEMPLATES.map((t) => {
            const Icon = t.Icon
            return (
              <button key={t.type} onClick={() => onAddNode(t.type, t.name)} title={t.name} className={`w-7 h-7 rounded-md border flex items-center justify-center ${t.accent} ${t.color} hover:scale-110 transition-transform`}>
                <Icon className="h-3.5 w-3.5" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
