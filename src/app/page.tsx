'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkflowStore } from '@/store/workflow-store'
import { generateId, formatDate } from '@/lib/utils'
import { Workflow } from '@/types/workflow'
import Link from 'next/link'

export default function WorkflowList() {
  const { workflows, addWorkflow, deleteWorkflow, filters, setFilters, getFilteredWorkflows } = useWorkflowStore()
  const [searchTerm, setSearchTerm] = useState(filters.search)
  
  const filteredWorkflows = getFilteredWorkflows()

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: generateId(),
      name: `New Workflow ${workflows.length + 1}`,
      description: 'A new workflow',
      tags: [],
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    }
    addWorkflow(newWorkflow)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters({ search: value })
  }

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">Workflows</h1>
            <p className="text-muted-foreground mt-2 text-lg">Create and manage your automated workflows</p>
          </div>
          <Button onClick={handleCreateWorkflow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-all duration-200 hover:shadow-xl border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-card-foreground">{workflow.name}</CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground">{workflow.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Nodes: {workflow.nodes.length}</span>
                    <span>Edges: {workflow.edges.length}</span>
                  </div>
                  {workflow.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(workflow.updatedAt)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Link href={`/workflow/${workflow.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4 text-lg">
              {searchTerm ? 'No workflows found matching your search.' : 'No workflows yet.'}
            </div>
            {!searchTerm && (
              <Button onClick={handleCreateWorkflow} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create your first workflow
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
