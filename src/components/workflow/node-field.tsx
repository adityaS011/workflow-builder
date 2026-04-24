'use client'

import { NodeFieldDef } from '@/types/workflow'
import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form'

interface NodeFieldProps<TValues extends FieldValues> {
  field: NodeFieldDef
  register: UseFormRegister<TValues>
  error?: FieldError
}

const BASE_CLASS =
  'w-full px-3 py-1.5 text-xs rounded-lg border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors'

export function NodeField<TValues extends FieldValues>({ field, register, error }: NodeFieldProps<TValues>) {
  const errorClass = error ? 'border-destructive/60 focus:ring-destructive/60' : 'border-border focus:ring-primary/60'
  const cls = `${BASE_CLASS} ${errorClass}`
  const registered = register(field.key as Path<TValues>)

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{field.label}</label>

      {field.type === 'textarea' && (
        <textarea className={`${cls} resize-none`} rows={3} placeholder={field.placeholder} {...registered} />
      )}

      {field.type === 'select' && (
        <select className={cls} {...registered}>
          <option value="">{field.placeholder ?? 'Select…'}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {(field.type === 'text' || field.type === 'number') && (
        <input
          type={field.type}
          className={cls}
          placeholder={field.placeholder}
          step={field.step}
          min={field.min}
          max={field.max}
          {...registered}
        />
      )}

      {error?.message && <p className="text-[11px] text-destructive">{error.message}</p>}
    </div>
  )
}
