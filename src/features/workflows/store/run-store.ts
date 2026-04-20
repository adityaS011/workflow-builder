import { create } from 'zustand'

export type RunStatus = 'idle' | 'running' | 'success' | 'error'

interface RunStore {
  runStatus: RunStatus
  activeNodeId: string | null
  completedNodeIds: string[]
  errorNodeId: string | null

  setRunStatus: (status: RunStatus) => void
  setActiveNodeId: (id: string | null) => void
  setCompletedNodeIds: (ids: string[]) => void
  setErrorNodeId: (id: string | null) => void
  resetRunState: () => void
}

const INITIAL: Pick<RunStore, 'runStatus' | 'activeNodeId' | 'completedNodeIds' | 'errorNodeId'> = {
  runStatus: 'idle',
  activeNodeId: null,
  completedNodeIds: [],
  errorNodeId: null,
}

export const useRunStore = create<RunStore>()((set) => ({
  ...INITIAL,
  setRunStatus: (runStatus) => set({ runStatus }),
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
  setCompletedNodeIds: (completedNodeIds) => set({ completedNodeIds }),
  setErrorNodeId: (errorNodeId) => set({ errorNodeId }),
  resetRunState: () => set(INITIAL),
}))
