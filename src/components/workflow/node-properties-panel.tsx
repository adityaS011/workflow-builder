'use client'

import { useEffect } from 'react'
import { useForm, type FieldValues, type Resolver, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflow-store'
import { getNodeMeta } from './node-meta'
import { getNodeFields } from './node-fields'
import { NODE_SCHEMAS } from '@/lib/schemas'
import { NodeField } from './node-field'

type NodeKind = keyof typeof NODE_SCHEMAS

function getSchema(type: string) {
  return NODE_SCHEMAS[type as NodeKind]
}

export function NodePropertiesPanel() {
  const { selectedNodes, currentWorkflow, updateNode, clearSelection } = useWorkflowStore()
  const selectedNodeId = selectedNodes[0]
  const selectedNode = currentWorkflow?.nodes.find((n) => n.id === selectedNodeId) ?? null

  const fields = selectedNode ? getNodeFields(selectedNode.type) : []
  const schema = selectedNode ? getSchema(selectedNode.type) : undefined

  const defaultValues: Record<string, string> = {}
  if (selectedNode) {
    for (const f of fields) {
      defaultValues[f.key] = String((selectedNode.data.config ?? {})[f.key] ?? '')
    }
  }

  const resolver = schema ? (zodResolver(schema) as unknown as Resolver<FieldValues>) : undefined

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FieldValues>({
    resolver,
    defaultValues,
  })

  useEffect(() => { reset(defaultValues) }, [selectedNodeId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedNode) return null

  const meta = getNodeMeta(selectedNode.type)
  const Icon = meta.Icon

  const onSubmit = (values: FieldValues) => {
    updateNode(selectedNode.id, {
      data: {
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        config: values as Record<string, unknown>,
      },
    })
    toast.success('Node updated', { description: selectedNode.data.label })
    clearSelection()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-80 bg-card border-l border-border h-full flex flex-col flex-shrink-0">
      <div className="flex items-center gap-2 px-3 h-12 border-b border-border flex-shrink-0">
        <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
        <span className="text-xs font-semibold text-foreground flex-1 truncate">{selectedNode.data.label}</span>
        <button type="button" onClick={clearSelection} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">No configuration for this node type.</p>
        ) : (
          fields.map((field) => (
            <NodeField key={field.key} field={field} register={register} error={errors[field.key] as FieldError | undefined} />
          ))
        )}
      </div>

      <div className="p-3 border-t border-border flex-shrink-0">
        <Button type="submit" disabled={!isDirty} className="w-full h-8 text-xs bg-primary hover:bg-primary/90 disabled:opacity-50">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}
