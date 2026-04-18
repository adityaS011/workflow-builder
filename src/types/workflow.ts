export interface WorkflowNode {
  id: string;
  type: 'event' | 'filter' | 'condition' | 'action';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config?: Record<string, unknown>;
  };
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  tags: string[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Omit<WorkflowNode, 'id' | 'position'>[];
  thumbnail?: string;
}

export interface NodeTemplate {
  type: WorkflowNode['type'];
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultConfig?: Record<string, any>;
  inputs?: string[];
  outputs?: string[];
}
