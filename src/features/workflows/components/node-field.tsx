'use client'

import { NodeFieldDef } from '@/types/workflow'

interface NodeFieldProps {
  field: NodeFieldDef
  value: string
  onChange: (key: string, value: string) => void
}

const BASE_CLASS =
  'w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors'

export function NodeField({ field, value, onChange }: NodeFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange(field.key, e.target.value)

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">
        {field.label}
      </label>

      {field.type === 'textarea' && (
        <textarea
          className={`${BASE_CLASS} resize-none`}
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange}
        />
      )}

      {field.type === 'select' && (
        <select
          className={BASE_CLASS}
          value={value}
          onChange={handleChange}
        >
          <option value="">{field.placeholder ?? 'Select…'}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {(field.type === 'text' || field.type === 'number') && (
        <input
          type={field.type}
          className={BASE_CLASS}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange}
          step={field.step}
          min={field.min}
          max={field.max}
        />
      )}
    </div>
  )
}
