import type { RuntimeInputField } from '@/types/workflow'

const FIELD_TYPES = new Set<RuntimeInputField['type']>(['text', 'textarea', 'number'])

function toKey(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/^[^a-zA-Z]+/, '')
    .replace(/^./, (char) => char.toLowerCase())
}

export function parseInputFields(value: unknown): RuntimeInputField[] {
  if (typeof value !== 'string') return []

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, ...rest] = line.split('|').map((part) => part.trim())
      const [rawKey, rawLabel] = namePart.includes(':')
        ? namePart.split(':').map((part) => part.trim())
        : [toKey(namePart), namePart]
      const type = FIELD_TYPES.has(rest[0] as RuntimeInputField['type'])
        ? rest[0] as RuntimeInputField['type']
        : 'text'
      const required = rest.some((part) => part.toLowerCase() === 'required')

      return {
        key: toKey(rawKey || rawLabel),
        label: rawLabel || rawKey,
        type,
        required,
        placeholder: rest.find((part) => part && !FIELD_TYPES.has(part as RuntimeInputField['type']) && part.toLowerCase() !== 'required'),
      }
    })
    .filter((field) => field.key && field.label)
}

export function parseDefaultInputValues(value: unknown): Record<string, string> {
  if (typeof value !== 'string' || value.trim() === '') return {}

  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).map(([key, fieldValue]) => [key, String(fieldValue ?? '')])
    )
  } catch {
    return {}
  }
}
