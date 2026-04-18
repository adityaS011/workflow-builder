'use client'

import { useState } from 'react'
import { Search, Play, Filter, GitBranch, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NodeTemplate {
  type: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'event',
    name: 'Event Trigger',
    description: 'Start workflow on product event',
    icon: <Play className="h-4 w-4" />,
    category: 'Trigger',
  },
  {
    type: 'filter',
    name: 'Filter',
    description: 'Filter events by properties',
    icon: <Filter className="h-4 w-4" />,
    category: 'Logic',
  },
  {
    type: 'condition',
    name: 'Condition',
    description: 'Aggregate and evaluate conditions',
    icon: <GitBranch className="h-4 w-4" />,
    category: 'Logic',
  },
  {
    type: 'action',
    name: 'Action',
    description: 'Execute actions like alerts or logging',
    icon: <Zap className="h-4 w-4" />,
    category: 'Action',
  },
]

interface WorkflowSidebarProps {
  onAddNode: (type: string, label: string) => void
}

export function WorkflowSidebar({ onAddNode }: WorkflowSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const categories = ['all', ...Array.from(new Set(nodeTemplates.map(t => t.category)))]

  const filteredTemplates = nodeTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddNode = (template: NodeTemplate) => {
    onAddNode(template.type, template.name)
  }

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-80'} bg-card border-r border-border h-full flex flex-col transition-all duration-200`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold text-foreground mb-4">Node Library</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>  
      {/* Search */}
      {!isCollapsed && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
      )}

      {/* Categories */}
      {!isCollapsed && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Node Templates */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.type}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:shadow-lg border-border bg-card hover:bg-accent/50"
              onClick={() => handleAddNode(template)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                  {template.icon}
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{template.description}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    {template.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No nodes found matching your search.
          </div>
        )}
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground">
            Click nodes to add them sequentially. They will auto-connect to the previous node.
          </div>
        </div>
      )}
    </div>
  )
}
