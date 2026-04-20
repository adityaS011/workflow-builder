import { useCallback } from 'react'
import { toast } from 'sonner'
import { useWorkflowStore } from '@/features/workflows/store/workflow-store'
import { useRunStore } from '@/features/workflows/store/run-store'
import { WorkflowNode, WorkflowEdge } from '@/features/workflows/types'

function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const outgoing = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  nodes.forEach((n) => { outgoing.set(n.id, []); inDegree.set(n.id, 0) })
  edges.forEach((e) => {
    outgoing.get(e.source)?.push(e.target)
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1)
  })

  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0)
  const sorted: WorkflowNode[] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    sorted.push(node)
    for (const neighborId of outgoing.get(node.id) ?? []) {
      const deg = (inDegree.get(neighborId) ?? 0) - 1
      inDegree.set(neighborId, deg)
      if (deg === 0) {
        const neighbor = nodes.find((n) => n.id === neighborId)
        if (neighbor) queue.push(neighbor)
      }
    }
  }

  return sorted.length === nodes.length ? sorted : nodes
}

export function useRunWorkflow() {
  const { currentWorkflow, validateWorkflow } = useWorkflowStore()
  const { setRunStatus, setActiveNodeId, setCompletedNodeIds, setErrorNodeId, resetRunState } = useRunStore()

  const run = useCallback(async () => {
    if (!currentWorkflow) return

    const { valid, errors } = validateWorkflow()
    if (!valid) {
      toast.error('Cannot run workflow', {
        description: errors.join(' · '),
      })
      return
    }

    resetRunState()
    setRunStatus('running')
    toast.info('Running workflow…', { duration: 1500 })

    const sorted = topologicalSort(currentWorkflow.nodes, currentWorkflow.edges)
    const completed: string[] = []

    for (const node of sorted) {
      setActiveNodeId(node.id)
      await new Promise<void>((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

      const mightFail = node.type === 'http' || node.type === 'llm'
      if (mightFail && Math.random() < 0.08) {
        setErrorNodeId(node.id)
        setActiveNodeId(null)
        setRunStatus('error')
        toast.error(`${node.data.label} failed`, {
          description: 'Simulated network error. Check logs and retry.',
        })
        return
      }

      completed.push(node.id)
      setCompletedNodeIds([...completed])
    }

    setActiveNodeId(null)
    setRunStatus('success')
    toast.success('Workflow completed', { description: `${sorted.length} steps executed` })
    setTimeout(() => resetRunState(), 3000)
  }, [currentWorkflow, validateWorkflow, setRunStatus, setActiveNodeId, setCompletedNodeIds, setErrorNodeId, resetRunState])

  const stop = useCallback(() => resetRunState(), [resetRunState])

  return { run, stop }
}
