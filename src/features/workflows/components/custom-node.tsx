'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { CheckCircle, Loader, XCircle } from 'lucide-react'
import { getNodeMeta } from './node-meta'
import { useRunStore } from '@/features/workflows/store/run-store'

type NodeData = {
  type: string
  label: string
  description?: string
  config?: Record<string, unknown>
}

export const CustomNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as NodeData
  const { activeNodeId, completedNodeIds, errorNodeId } = useRunStore()
  const meta = getNodeMeta(nodeData.type)
  const Icon = meta.Icon

  const isActive = activeNodeId === id
  const isCompleted = completedNodeIds.includes(id)
  const hasError = errorNodeId === id

  const ringClass = hasError
    ? 'ring-2 ring-destructive/60'
    : isCompleted
    ? 'ring-2 ring-emerald-400/60'
    : isActive
    ? 'ring-2 ring-primary animate-pulse'
    : selected
    ? 'ring-2 ring-primary/70'
    : ''

  const configEntries = nodeData.config
    ? Object.entries(nodeData.config).filter(([, v]) => v !== '' && v !== undefined)
    : []

  const statusIcon = hasError ? (
    <XCircle className="h-3.5 w-3.5 text-destructive" />
  ) : isCompleted ? (
    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
  ) : isActive ? (
    <Loader className="h-3.5 w-3.5 text-primary animate-spin" />
  ) : (
    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
  )

  const handleStyle = (color: string) => ({
    width: 9,
    height: 9,
    background: color,
    border: '2px solid #0c0c10',
  })

  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle(meta.handleColor), top: -5 }} />

      <div className={`min-w-[160px] max-w-[190px] rounded-lg border bg-card shadow-md ${meta.border} ${ringClass} transition-all duration-150`}>
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-t-lg ${meta.bg} border-b ${meta.border}`}>
          <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${meta.color}`} />
          <span className="text-xs font-semibold text-foreground flex-1 truncate">{nodeData.label}</span>
          <span className="flex-shrink-0">{statusIcon}</span>
        </div>

        <div className="px-2.5 py-1.5">
          {nodeData.description ? (
            <p className="text-[11px] text-muted-foreground truncate">{nodeData.description}</p>
          ) : configEntries.length === 0 ? (
            <p className="text-[11px] text-muted-foreground/50 italic">Not configured</p>
          ) : null}
          {configEntries.slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1 text-[11px] mt-0.5">
              <span className="text-muted-foreground capitalize">{key}:</span>
              <span className="text-foreground/80 truncate max-w-[105px]">{String(value)}</span>
            </div>
          ))}
          {configEntries.length > 2 && (
            <div className="text-[11px] text-muted-foreground/50">+{configEntries.length - 2} more</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleStyle(meta.handleColor), bottom: -5 }} />
      {nodeData.type === 'condition' && (
        <Handle type="source" position={Position.Right} id="right" style={{ ...handleStyle('#ef4444'), right: -5 }} />
      )}
    </>
  )
})

CustomNode.displayName = 'CustomNode'
