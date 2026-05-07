import { z } from 'zod'

export const NodeTypeSchema = z.enum(['input', 'llm', 'transform', 'condition', 'http', 'output'])
const PersistedNodeTypeSchema = z.enum(['input', 'trigger', 'llm', 'transform', 'condition', 'http', 'output'])

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: PersistedNodeTypeSchema,
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({
    label: z.string().min(1),
    description: z.string().optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
}).transform((node) => (
  node.type === 'trigger'
    ? {
        ...node,
        type: 'input' as const,
        data: {
          ...node.data,
          label: node.data.label === 'Trigger' ? 'Input' : node.data.label.replace(/trigger/i, 'input'),
        },
      }
    : node
))

export const WorkflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
})

export const WorkflowStatusSchema = z.enum(['draft', 'published', 'archived'])

export const WorkflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  tags: z.array(z.string()),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: WorkflowStatusSchema,
})

export const PersistedStateSchema = z.object({
  workflows: z.array(WorkflowSchema),
  filters: z.object({
    search: z.string(),
    tags: z.array(z.string()),
    status: z.string(),
  }),
})

// Per-node-type config schemas (used by RHF resolver)
export const InputConfigSchema = z.object({
  fields: z.string(),
  defaultValues: z.string(),
  instructions: z.string(),
})

export const LlmConfigSchema = z.object({
  provider: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
  temperature: z.string(),
  maxTokens: z.string(),
})

export const TransformConfigSchema = z.object({
  transformType: z.string(),
  expression: z.string(),
  outputKey: z.string(),
})

export const ConditionConfigSchema = z.object({
  operator: z.string(),
  property: z.string(),
  value: z.string(),
  trueLabel: z.string(),
  falseLabel: z.string(),
})

export const HttpConfigSchema = z.object({
  method: z.string(),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
  headers: z.string(),
  body: z.string(),
  authType: z.string(),
})

export const OutputConfigSchema = z.object({
  outputType: z.string(),
  message: z.string(),
  destination: z.string(),
  webhookUrl: z.string().url('Must be a valid URL').or(z.literal('')),
})

export const NODE_SCHEMAS = {
  input: InputConfigSchema,
  llm: LlmConfigSchema,
  transform: TransformConfigSchema,
  condition: ConditionConfigSchema,
  http: HttpConfigSchema,
  output: OutputConfigSchema,
} as const
