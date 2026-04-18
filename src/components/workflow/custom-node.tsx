'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Play, Filter, GitBranch, Zap } from 'lucide-react'

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as {
    type: string
    label: string
    description?: string
    config?: Record<string, unknown>
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Play className="h-4 w-4 text-green-600" />
      case 'filter': return <Filter className="h-4 w-4 text-blue-600" />
      case 'condition': return <GitBranch className="h-4 w-4 text-purple-600" />
      case 'action': return <Zap className="h-4 w-4 text-orange-600" />
      default: return <Play className="h-4 w-4 text-gray-600" />
    }
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'event': return 'border-green-200 bg-green-50'
      case 'filter': return 'border-blue-200 bg-blue-50'
      case 'condition': return 'border-purple-200 bg-purple-50'
      case 'action': return 'border-orange-200 bg-orange-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <>
      {/* Top Handle */}
      {nodeData.type !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-3 h-3 bg-blue-400 border-2 border-white"
        />
      )}

      <Card className={`min-w-[160px] max-w-[200px] ${getNodeColor(nodeData.type)} ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-1 px-3 py-2">
          <div className="flex items-center gap-1">
            {getIcon(nodeData.type)}
            <span className="font-medium text-xs">{nodeData.label}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 py-2">
          {nodeData.description && (
            <p className="text-xs text-gray-600 mb-1 truncate">{nodeData.description}</p>
          )}
          
          {/* Node Configuration Display */}
          {nodeData.config && Object.keys(nodeData.config).length > 0 && (
            <div className="text-xs text-gray-500">
              {Object.entries(nodeData.config).slice(0, 1).map(([key, value]) => (
                <div key={key} className="truncate">
                  {key}: {String(value)}
                </div>
              ))}
              {Object.keys(nodeData.config).length > 1 && (
                <div className="text-gray-400">...</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Handle */}
      {nodeData.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-3 h-3 bg-green-400 border-2 border-white"
        />
      )}
    </>
  )
})

CustomNode.displayName = 'CustomNode'
