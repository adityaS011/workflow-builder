'use client'

import { useState } from 'react'
import { X, Save, Play, Filter, GitBranch, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflow-store'

export function NodePropertiesPanel() {
  const { selectedNodes, updateNode, currentWorkflow, clearSelection } = useWorkflowStore()
  const [formData, setFormData] = useState<Record<string, any>>({})

  const selectedNodeId = selectedNodes[0] // Get first selected node
  const selectedNode = currentWorkflow?.nodes.find(n => n.id === selectedNodeId) || null

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Play className="h-4 w-4 text-green-600" />
      case 'filter': return <Filter className="h-4 w-4 text-blue-600" />
      case 'condition': return <GitBranch className="h-4 w-4 text-purple-600" />
      case 'action': return <Zap className="h-4 w-4 text-orange-600" />
      default: return <Play className="h-4 w-4 text-gray-600" />
    }
  }

  const getNodeFields = (type: string) => {
    switch (type) {
      case 'event':
        return [
          { key: 'eventName', label: 'Event Name', type: 'text', placeholder: 'button_click' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe this event trigger...' },
        ]
      case 'filter':
        return [
          { key: 'property', label: 'Property', type: 'text', placeholder: 'country' },
          { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not_equals', 'contains', 'not_contains'], placeholder: 'Select operator...' },
          { key: 'value', label: 'Value', type: 'text', placeholder: 'India' },
        ]
      case 'condition':
        return [
          { key: 'metric', label: 'Metric', type: 'select', options: ['count', 'sum', 'avg'], placeholder: 'Select metric...' },
          { key: 'operator', label: 'Operator', type: 'select', options: ['>', '<', '>=', '<=', '=='], placeholder: 'Select operator...' },
          { key: 'threshold', label: 'Threshold', type: 'number', placeholder: '100' },
          { key: 'timeWindow', label: 'Time Window (minutes)', type: 'number', placeholder: '5' },
        ]
      case 'action':
        return [
          { key: 'actionType', label: 'Action Type', type: 'select', options: ['console_log', 'slack_webhook', 'alert'], placeholder: 'Select action...' },
          { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Action message...' },
          { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/...' },
        ]
      default:
        return []
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (selectedNodeId && selectedNode) {
      updateNode(selectedNodeId, { 
        data: { 
          label: selectedNode?.data?.label || '',
          description: selectedNode?.data?.description || '',
          config: formData 
        }
      })
      // Clear selection to close the panel
      clearSelection()
      // Reset form data
      setFormData({})
    }
  }

  if (!selectedNode) {
    return (
      <div className="w-80 bg-card border-l border-border h-full p-4">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <Play className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">Select a node to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const fields = getNodeFields(selectedNode?.data?.type || '')

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(selectedNode?.data?.type || '')}
            <span className="font-medium text-sm">{selectedNode?.data?.label || ''}</span>
          </div>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full p-2 border border-border rounded-md bg-background text-card-foreground text-sm"
                  rows={3}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full p-2 border border-border rounded-md bg-background text-card-foreground text-sm"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full p-2 border border-border rounded-md bg-background text-card-foreground text-sm"
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
