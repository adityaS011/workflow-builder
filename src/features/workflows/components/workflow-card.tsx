'use client'

import { useRouter } from 'next/navigation'
import { Edit, Trash2, Copy, GitBranch } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Workflow } from '@/features/workflows/types'
import { formatDate } from '@/shared/lib/utils'

interface WorkflowCardProps {
  workflow: Workflow
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

const STATUS_STYLE: Record<Workflow['status'], string> = {
  published: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  archived: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
}

export function WorkflowCard({ workflow, onDelete, onDuplicate }: WorkflowCardProps) {
  const router = useRouter()

  const openEditor = () => router.push(`/workflow/${workflow.id}`)

  const stopAndRun = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    fn()
  }

  return (
    <div
      onClick={openEditor}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEditor()}
      className="group self-start bg-card border border-border rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">{workflow.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{workflow.description}</p>
        </div>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[workflow.status]}`}>
          {workflow.status}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {workflow.nodes.length} step{workflow.nodes.length !== 1 ? 's' : ''}
        </span>
        <span>{workflow.edges.length} connection{workflow.edges.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tags */}
      {workflow.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {workflow.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <span className="text-xs text-muted-foreground">{formatDate(workflow.updatedAt)}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary" onClick={stopAndRun(openEditor)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-secondary" onClick={stopAndRun(() => onDuplicate(workflow.id))} title="Duplicate">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onClick={stopAndRun(() => onDelete(workflow.id))} title="Delete">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
