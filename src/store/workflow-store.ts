import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Workflow, WorkflowNode, WorkflowEdge } from '@/types/workflow';

interface WorkflowStore {
  // State
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNodes: string[];
  selectedEdges: string[];
  filters: {
    search: string;
    tags: string[];
    status: string;
  };

  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  
  // Node/Edge actions
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  updateEdge: (id: string, updates: Partial<WorkflowEdge>) => void;
  deleteEdge: (id: string) => void;
  
  // Selection actions
  selectNodes: (nodeIds: string[]) => void;
  selectEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  
  // Filter actions
  setFilters: (filters: Partial<WorkflowStore['filters']>) => void;
  
  // Computed
  getFilteredWorkflows: () => Workflow[];
}

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        workflows: [],
        currentWorkflow: null,
        selectedNodes: [],
        selectedEdges: [],
        filters: {
          search: '',
          tags: [],
          status: 'all',
        },

        // Actions
        setWorkflows: (workflows) => set({ workflows }),
        
        addWorkflow: (workflow) => set((state) => ({
          workflows: [...state.workflows, workflow],
        })),
        
        updateWorkflow: (id, updates) => set((state) => ({
          workflows: state.workflows.map(w => 
            w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
          ),
          currentWorkflow: state.currentWorkflow?.id === id 
            ? { ...state.currentWorkflow, ...updates, updatedAt: new Date() }
            : state.currentWorkflow,
        })),
        
        deleteWorkflow: (id) => set((state) => ({
          workflows: state.workflows.filter(w => w.id !== id),
          currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
        })),
        
        setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
        
        addNode: (node) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            nodes: [...state.currentWorkflow.nodes, node],
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
          };
        }),
        
        updateNode: (id, updates) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.map(n => 
              n.id === id ? { ...n, ...updates } : n
            ),
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
          };
        }),
        
        deleteNode: (id) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.filter(n => n.id !== id),
            edges: state.currentWorkflow.edges.filter(e => 
              e.source !== id && e.target !== id
            ),
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
            selectedNodes: state.selectedNodes.filter(nId => nId !== id),
          };
        }),
        
        addEdge: (edge) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            edges: [...state.currentWorkflow.edges, edge],
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
          };
        }),
        
        updateEdge: (id, updates) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            edges: state.currentWorkflow.edges.map(e => 
              e.id === id ? { ...e, ...updates } : e
            ),
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
          };
        }),
        
        deleteEdge: (id) => set((state) => {
          if (!state.currentWorkflow) return state;
          
          const updatedWorkflow = {
            ...state.currentWorkflow,
            edges: state.currentWorkflow.edges.filter(e => e.id !== id),
            updatedAt: new Date(),
          };
          
          return {
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
            selectedEdges: state.selectedEdges.filter(eId => eId !== id),
          };
        }),
        
        selectNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
        selectEdges: (edgeIds) => set({ selectedEdges: edgeIds }),
        clearSelection: () => set({ selectedNodes: [], selectedEdges: [] }),
        
        setFilters: (filters) => set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
        
        getFilteredWorkflows: () => {
          const { workflows, filters } = get();
          
          return workflows.filter(workflow => {
            const matchesSearch = workflow.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                                 workflow.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesTags = filters.tags.length === 0 || 
                              filters.tags.some(tag => workflow.tags.includes(tag));
            const matchesStatus = filters.status === 'all' || workflow.status === filters.status;
            
            return matchesSearch && matchesTags && matchesStatus;
          });
        },
      }),
      {
        name: 'workflow-store',
        partialize: (state) => ({
          workflows: state.workflows,
          filters: state.filters,
        }),
      }
    )
  )
);
