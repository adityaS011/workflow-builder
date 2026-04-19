'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Square, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflow-store'
import { useRunStore, type RunStatus } from '@/store/run-store'
import { Workflow } from '@/types/workflow'

interface WorkflowHeaderProps {
  workflow: Workflow
  onRun: () => void
  onStop: () => void
  onExport: () => void
}

const RUN_ICON: Record<RunStatus, React.ReactNode> = {
  idle: <Play className="h-3.5 w-3.5" />,
  running: <Loader className="h-3.5 w-3.5 animate-spin" />,
  success: <CheckCircle className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
}

const RUN_LABEL: Record<RunStatus, string> = {
  idle: 'Run',
  running: 'Running…',
  success: 'Success',
  error: 'Failed',
}

const RUN_STYLE: Record<RunStatus, string> = {
  idle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  running: 'bg-amber-600 hover:bg-amber-700 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  error: 'bg-destructive hover:bg-destructive/90 text-white',
}

export function WorkflowHeader({ workflow, onRun, onStop, onExport }: WorkflowHeaderProps) {
  const { updateWorkflow } = useWorkflowStore()
  const { runStatus } = useRunStore()
  const [editing, setEditing] = useState(false)
  const [nameValue, setNameValue] = useState(workflow.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commitName = () => {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== workflow.name) {
      updateWorkflow(workflow.id, { name: trimmed })
    } else {
      setNameValue(workflow.name)
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') { setNameValue(workflow.name); setEditing(false) }
  }

  return (
    <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Button>
        </Link>
        <div className="w-px h-4 bg-border" />
        {editing ? (
          <input
            ref={inputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={handleKeyDown}
            className="text-sm font-semibold bg-secondary border border-primary/50 rounded px-2 py-0.5 text-foreground outline-none w-48"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            title="Click to rename"
          >
            {workflow.name}
          </button>
        )}
        <span className="text-xs text-muted-foreground">
          {workflow.nodes.length} node{workflow.nodes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={onExport} title="Export JSON">
          <Download className="h-3.5 w-3.5" />
        </Button>
        {runStatus === 'running' ? (
          <Button size="sm" className="h-7 bg-amber-600 hover:bg-amber-700 text-white gap-1.5" onClick={onStop}>
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        ) : (
          <Button size="sm" className={`h-7 gap-1.5 ${RUN_STYLE[runStatus]}`} onClick={onRun}>
            {RUN_ICON[runStatus]} {RUN_LABEL[runStatus]}
          </Button>
        )}
      </div>
    </div>
  )
}
