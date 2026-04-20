export type NodeType = 'trigger' | 'llm' | 'transform' | 'condition' | 'http' | 'output'

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config?: Record<string, unknown>
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  tags: string[]
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published' | 'archived'
}

export interface AnalyticsEvent {
  name: string
  properties: Record<string, unknown>
  timestamp: number
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  nodes: Omit<WorkflowNode, 'id' | 'position'>[]
  thumbnail?: string
}

export interface NodeTemplate {
  type: NodeType
  name: string
  description: string
  icon: string
  category: string
  defaultConfig?: Record<string, unknown>
  inputs?: string[]
  outputs?: string[]
}

export type FieldType = 'text' | 'textarea' | 'select' | 'number'

export interface NodeFieldDef {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[]
  step?: number
  min?: number
  max?: number
}
