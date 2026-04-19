import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Workflow, WorkflowNode, WorkflowEdge } from '@/types/workflow'
import { generateId } from '@/lib/utils'

export type { RunStatus } from './run-store'

interface Filters {
  search: string
  tags: string[]
  status: string
}

interface WorkflowStore {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  selectedNodes: string[]
  selectedEdges: string[]
  filters: Filters

  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  duplicateWorkflow: (id: string) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void

  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  addEdge: (edge: WorkflowEdge) => void
  updateEdge: (id: string, updates: Partial<WorkflowEdge>) => void
  deleteEdge: (id: string) => void

  selectNodes: (nodeIds: string[]) => void
  selectEdges: (edgeIds: string[]) => void
  clearSelection: () => void
  setFilters: (filters: Partial<Filters>) => void

  getFilteredWorkflows: () => Workflow[]
  validateWorkflow: () => { valid: boolean; errors: string[] }
}

function patchWorkflow(state: WorkflowStore, updated: Workflow): Partial<WorkflowStore> {
  return {
    currentWorkflow: state.currentWorkflow?.id === updated.id ? updated : state.currentWorkflow,
    workflows: state.workflows.map((w) => (w.id === updated.id ? updated : w)),
  }
}

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    persist(
      (set, get) => ({
        workflows: [],
        currentWorkflow: null,
        selectedNodes: [],
        selectedEdges: [],
        filters: { search: '', tags: [], status: 'all' },

        setWorkflows: (workflows) => set({ workflows }),

        addWorkflow: (workflow) =>
          set((s) => ({ workflows: [...s.workflows, workflow] })),

        updateWorkflow: (id, updates) =>
          set((s) => patchWorkflow(s, { ...(s.workflows.find((w) => w.id === id) ?? s.currentWorkflow!), ...updates, updatedAt: new Date() })),

        deleteWorkflow: (id) =>
          set((s) => ({
            workflows: s.workflows.filter((w) => w.id !== id),
            currentWorkflow: s.currentWorkflow?.id === id ? null : s.currentWorkflow,
          })),

        duplicateWorkflow: (id) =>
          set((s) => {
            const original = s.workflows.find((w) => w.id === id)
            if (!original) return s
            const copy: Workflow = { ...original, id: generateId(), name: `${original.name} (Copy)`, status: 'draft', createdAt: new Date(), updatedAt: new Date(), nodes: original.nodes.map((n) => ({ ...n, id: generateId() })), edges: [] }
            return { workflows: [...s.workflows, copy] }
          }),

        setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

        addNode: (node) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, nodes: [...s.currentWorkflow.nodes, node], updatedAt: new Date() }
            return patchWorkflow(s, updated)
          }),

        updateNode: (id, updates) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, nodes: s.currentWorkflow.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)), updatedAt: new Date() }
            return patchWorkflow(s, updated)
          }),

        deleteNode: (id) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, nodes: s.currentWorkflow.nodes.filter((n) => n.id !== id), edges: s.currentWorkflow.edges.filter((e) => e.source !== id && e.target !== id), updatedAt: new Date() }
            return { ...patchWorkflow(s, updated), selectedNodes: s.selectedNodes.filter((nId) => nId !== id) }
          }),

        addEdge: (edge) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, edges: [...s.currentWorkflow.edges, edge], updatedAt: new Date() }
            return patchWorkflow(s, updated)
          }),

        updateEdge: (id, updates) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, edges: s.currentWorkflow.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)), updatedAt: new Date() }
            return patchWorkflow(s, updated)
          }),

        deleteEdge: (id) =>
          set((s) => {
            if (!s.currentWorkflow) return s
            const updated = { ...s.currentWorkflow, edges: s.currentWorkflow.edges.filter((e) => e.id !== id), updatedAt: new Date() }
            return { ...patchWorkflow(s, updated), selectedEdges: s.selectedEdges.filter((eId) => eId !== id) }
          }),

        selectNodes: (selectedNodes) => set({ selectedNodes }),
        selectEdges: (selectedEdges) => set({ selectedEdges }),
        clearSelection: () => set({ selectedNodes: [], selectedEdges: [] }),
        setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

        getFilteredWorkflows: () => {
          const { workflows, filters } = get()
          return workflows.filter((w) => {
            const matchesSearch = w.name.toLowerCase().includes(filters.search.toLowerCase()) || w.description.toLowerCase().includes(filters.search.toLowerCase())
            const matchesTags = filters.tags.length === 0 || filters.tags.some((t) => w.tags.includes(t))
            const matchesStatus = filters.status === 'all' || w.status === filters.status
            return matchesSearch && matchesTags && matchesStatus
          })
        },

        validateWorkflow: () => {
          const { currentWorkflow } = get()
          if (!currentWorkflow) return { valid: false, errors: ['No workflow loaded'] }
          const errors: string[] = []
          if (currentWorkflow.nodes.length === 0) errors.push('Workflow has no nodes')
          if (!currentWorkflow.nodes.some((n) => n.type === 'trigger')) errors.push('Needs at least one Trigger node')
          if (currentWorkflow.nodes.length > 0 && !currentWorkflow.nodes.some((n) => n.type === 'output')) errors.push('Needs at least one Output node')
          const connectedIds = new Set(currentWorkflow.edges.flatMap((e) => [e.source, e.target]))
          const orphans = currentWorkflow.nodes.filter((n) => currentWorkflow.nodes.length > 1 && !connectedIds.has(n.id))
          if (orphans.length > 0) errors.push(`${orphans.length} node(s) are disconnected`)
          return { valid: errors.length === 0, errors }
        },
      }),
      {
        name: 'workflow-store',
        version: 2,
        migrate: () => ({ workflows: [], filters: { search: '', tags: [], status: 'all' } }),
        partialize: (s) => ({ workflows: s.workflows, filters: s.filters }),
      }
    )
  )
)
