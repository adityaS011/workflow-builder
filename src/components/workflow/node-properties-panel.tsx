'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflow-store'
import { getNodeMeta } from './node-meta'
import { getNodeFields } from './node-fields'
import { NodeField } from './node-field'

export function NodePropertiesPanel() {
  const { selectedNodes, currentWorkflow, updateNode, clearSelection } = useWorkflowStore()
  const [formData, setFormData] = useState<Record<string, string>>({})

  const selectedNodeId = selectedNodes[0]
  const selectedNode = currentWorkflow?.nodes.find((n) => n.id === selectedNodeId) ?? null

  // Pre-populate form when selected node changes
  useEffect(() => {
    if (selectedNode?.data?.config) {
      const stringified: Record<string, string> = {}
      for (const [k, v] of Object.entries(selectedNode.data.config)) {
        stringified[k] = String(v ?? '')
      }
      setFormData(stringified)
    } else {
      setFormData({})
    }
  }, [selectedNodeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    if (!selectedNodeId || !selectedNode) return
    updateNode(selectedNodeId, {
      data: {
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        config: formData as Record<string, unknown>,
      },
    })
    clearSelection()
  }

  if (!selectedNode) return null

  const meta = getNodeMeta(selectedNode.type)
  const Icon = meta.Icon
  const fields = getNodeFields(selectedNode.type)

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 h-12 border-b border-border flex-shrink-0">
        <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
        <span className="text-xs font-semibold text-foreground flex-1 truncate">{selectedNode.data.label}</span>
        <button
          onClick={clearSelection}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">No configuration for this node type.</p>
        ) : (
          fields.map((field) => (
            <NodeField
              key={field.key}
              field={field}
              value={formData[field.key] ?? ''}
              onChange={handleChange}
            />
          ))
        )}
      </div>

      {/* Save */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <Button onClick={handleSave} className="w-full h-8 text-xs bg-primary hover:bg-primary/90">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
