'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Play, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { parseDefaultInputValues } from '@/lib/input-fields'
import type { RuntimeInputField, WorkflowNode } from '@/types/workflow'

interface RunInputDialogProps {
  inputNode: WorkflowNode
  fields: RuntimeInputField[]
  onCancel: () => void
  onRun: (values: Record<string, string>) => void
}

export function RunInputDialog({ inputNode, fields, onCancel, onRun }: RunInputDialogProps) {
  const defaults = useMemo(() => parseDefaultInputValues(inputNode.data.config?.defaultValues), [inputNode])
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, defaults[field.key] ?? '']))
  )

  const updateValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const missing = fields.filter((field) => field.required && !values[field.key]?.trim())
    if (missing.length > 0) {
      toast.error('Missing required input', {
        description: missing.map((field) => field.label).join(', '),
      })
      return
    }

    onRun(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Run Workflow</h2>
            <p className="text-xs text-muted-foreground">{inputNode.data.label}</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-4">
          {typeof inputNode.data.config?.instructions === 'string' && inputNode.data.config.instructions.trim() !== '' && (
            <p className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
              {inputNode.data.config.instructions}
            </p>
          )}

          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                {field.label}
                {field.required && <span className="text-destructive"> *</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  rows={4}
                  placeholder={field.placeholder}
                  className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
                />
              ) : (
                <input
                  type={field.type}
                  value={values[field.key] ?? ''}
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700">
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
        </div>
      </form>
    </div>
  )
}
