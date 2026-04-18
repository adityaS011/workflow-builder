'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { WorkflowSidebar } from './workflow-sidebar'
import { CustomNode } from './custom-node'
import { NodePropertiesPanel } from './node-properties-panel'
import { useWorkflowStore } from '@/store/workflow-store'
import { generateId } from '@/lib/utils'

const nodeTypes = {
  custom: CustomNode,
}

export function WorkflowEditor() {
  const { currentWorkflow, addNode, addEdge: addStoreEdge, updateNode, selectNodes } = useWorkflowStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentWorkflow?.nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: node.data,
    })) || []
  )
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentWorkflow?.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
    })) || []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge = {
          id: generateId(),
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle || undefined,
          targetHandle: params.targetHandle || undefined,
        }
        
        setEdges((eds) => addEdge(params, eds))
        addStoreEdge(newEdge)
      }
    },
    [setEdges, addStoreEdge]
  )

  const onNodeDragStop = useCallback(
    (event: any, node: any) => {
      updateNode(node.id, { position: node.position })
    },
    [updateNode]
  )

  const onNodeClick = useCallback(
    (event: any, node: any) => {
      selectNodes([node.id])
    },
    [selectNodes]
  )

  const handleAddNode = useCallback((type: string, label: string) => {
    // Calculate position for sequential layout
    const lastNode = nodes[nodes.length - 1];
    const position = lastNode 
      ? { x: lastNode.position.x, y: lastNode.position.y + 150 } // Position below last node
      : { x: 100, y: 100 }; // First node position

    const newNode = {
      id: generateId(),
      type: 'custom' as const,
      position,
      data: {
        type,
        label,
        config: {},
      },
    }
    
    // Auto-connect to previous node if it exists
    if (lastNode) {
      const newEdge = {
        id: generateId(),
        source: lastNode.id,
        target: newNode.id,
        sourceHandle: 'bottom',
        targetHandle: 'top',
      }
      
      setNodes((nds) => [...nds, newNode])
      setEdges((eds) => [...eds, newEdge])
      
      addNode({
        id: newNode.id,
        type: type as 'event' | 'filter' | 'condition' | 'action',
        position: newNode.position,
        data: newNode.data,
      })
      addStoreEdge(newEdge)
    } else {
      // First node, just add without connection
      setNodes((nds) => [...nds, newNode])
      addNode({
        id: newNode.id,
        type: type as 'event' | 'filter' | 'condition' | 'action',
        position: newNode.position,
        data: newNode.data,
      })
    }
  }, [nodes, setNodes, setEdges, addNode, addStoreEdge])

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Workflow not found</h2>
          <p className="text-muted-foreground">The workflow you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <WorkflowSidebar onAddNode={handleAddNode} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Product Analytics Workflow</h1>
          </div>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4" />
            Execute
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-muted/30">
          <div className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e5e5" />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <NodePropertiesPanel />
    </div>
  )
}
