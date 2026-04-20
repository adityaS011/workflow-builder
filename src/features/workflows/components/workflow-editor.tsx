'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { WorkflowSidebar } from './workflow-sidebar'
import { WorkflowCanvas } from './workflow-canvas'
import { WorkflowHeader } from './workflow-header'
import { NodePropertiesPanel } from './node-properties-panel'
import { useWorkflowStore } from '@/features/workflows/store/workflow-store'
import { useRunWorkflow } from '@/features/workflows/hooks/use-run-workflow'
import type { Node, Edge } from '@xyflow/react'

export function WorkflowEditor() {
  const { currentWorkflow } = useWorkflowStore()
  const { run, stop } = useRunWorkflow()

  // Stable ref so WorkflowCanvas can expose its addNode handler upward
  const addNodeRef = useRef<(type: string, label: string) => void>(() => {})
  const registerAddNode = (fn: (type: string, label: string) => void) => {
    addNodeRef.current = fn
  }

  const handleExport = () => {
    if (!currentWorkflow) return
    const json = JSON.stringify(currentWorkflow, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentWorkflow.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Workflow not found</h2>
          <Link href="/">
            <Button variant="outline" size="sm" className="mt-2">Go back</Button>
          </Link>
        </div>
      </div>
    )
  }

  const initialNodes: Node[] = currentWorkflow.nodes.map((n) => ({
    id: n.id,
    type: 'custom',
    position: n.position,
    data: n.data,
  }))

  const initialEdges: Edge[] = currentWorkflow.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    animated: true,
  }))

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkflowSidebar onAddNode={(type, label) => addNodeRef.current(type, label)} />

      <div className="flex flex-1 flex-col min-w-0">
        <WorkflowHeader
          workflow={currentWorkflow}
          onRun={run}
          onStop={stop}
          onExport={handleExport}
        />
        <WorkflowCanvas
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          onAddNodeRef={registerAddNode}
        />
      </div>

      <NodePropertiesPanel />
    </div>
  )
}
