'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  MiniMap,
  Controls,
  type Connection,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { CustomNode } from './custom-node'
import { useWorkflowStore } from '@/store/workflow-store'
import { generateId } from '@/lib/utils'
import { WorkflowNode, WorkflowEdge } from '@/types/workflow'

const NODE_TYPES = { custom: CustomNode }

interface WorkflowCanvasProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onAddNodeRef: (fn: (type: string, label: string) => void) => void
}

export function WorkflowCanvas({ initialNodes, initialEdges, onAddNodeRef }: WorkflowCanvasProps) {
  const { addNode, addEdge: addStoreEdge, updateNode, selectNodes } = useWorkflowStore()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      const newEdge: WorkflowEdge = {
        id: generateId(),
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
      }
      setEdges((eds) => addEdge(params, eds))
      addStoreEdge(newEdge)
    },
    [setEdges, addStoreEdge]
  )

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => updateNode(node.id, { position: node.position }),
    [updateNode]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => selectNodes([node.id]),
    [selectNodes]
  )

  const handleAddNode = useCallback(
    (type: string, label: string) => {
      const last = nodes[nodes.length - 1]
      const position = last ? { x: last.position.x, y: last.position.y + 120 } : { x: 180, y: 100 }
      const newNode: Node = { id: generateId(), type: 'custom', position, data: { type, label, config: {} } }
      const storeNode: WorkflowNode = { id: newNode.id, type: type as WorkflowNode['type'], position, data: newNode.data as WorkflowNode['data'] }

      setNodes((nds) => [...nds, newNode])
      addNode(storeNode)

      if (last) {
        const edge: WorkflowEdge = { id: generateId(), source: last.id, target: newNode.id, sourceHandle: 'bottom', targetHandle: 'top' }
        setEdges((eds) => [...eds, { id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle, animated: true }])
        addStoreEdge(edge)
      }
    },
    [nodes, setNodes, setEdges, addNode, addStoreEdge]
  )

  onAddNodeRef(handleAddNode)

  return (
    <div className="flex-1 bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        nodeTypes={NODE_TYPES}
        fitView
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e1e2e" />
        <MiniMap nodeColor="#6366f1" maskColor="rgba(12,12,16,0.8)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
