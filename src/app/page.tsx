'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, Zap, GitBranch, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatsBar } from '@/components/home/stats-bar'
import { WorkflowCard } from '@/components/home/workflow-card'
import { useWorkflowStore } from '@/store/workflow-store'
import { generateId } from '@/lib/utils'
import { createSampleWorkflow } from '@/lib/sample-workflow'
import { Workflow } from '@/types/workflow'

const STATUS_TABS = ['all', 'draft', 'published', 'archived'] as const
type StatusTab = typeof STATUS_TABS[number]

export default function WorkflowList() {
  const router = useRouter()
  const { workflows, addWorkflow, deleteWorkflow, duplicateWorkflow, filters, setFilters, getFilteredWorkflows } = useWorkflowStore()
  const [searchTerm, setSearchTerm] = useState(filters.search)
  const [activeTab, setActiveTab] = useState<StatusTab>('all')

  const filteredWorkflows = getFilteredWorkflows()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters({ search: value })
  }

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab)
    setFilters({ status: tab })
  }

  const handleCreate = () => {
    const workflow: Workflow = {
      id: generateId(),
      name: 'Untitled Workflow',
      description: 'Describe what this pipeline does…',
      tags: [],
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
    }
    addWorkflow(workflow)
    toast.success('Workflow created')
    router.push(`/workflow/${workflow.id}`)
  }

  const handleLoadSample = () => {
    const sample = createSampleWorkflow()
    addWorkflow(sample)
    toast.success('Sample loaded', { description: 'AI Support Ticket Triage' })
    router.push(`/workflow/${sample.id}`)
  }

  const handleDelete = (id: string) => {
    const workflow = workflows.find((w) => w.id === id)
    deleteWorkflow(id)
    toast.success('Workflow deleted', { description: workflow?.name })
  }

  const handleDuplicate = (id: string) => {
    duplicateWorkflow(id)
    toast.success('Workflow duplicated')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">FlowAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLoadSample} size="sm" variant="outline" className="gap-1.5 border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200">
              <Sparkles className="h-3.5 w-3.5" /> Load Sample
            </Button>
            <Button onClick={handleCreate} size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" /> New Workflow
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Workflows</h1>
          <p className="text-muted-foreground mt-1">Build and deploy AI pipelines visually.</p>
        </div>

        <StatsBar
          total={workflows.length}
          published={workflows.filter((w) => w.status === 'published').length}
          draft={workflows.filter((w) => w.status === 'draft').length}
        />

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
            <Input placeholder="Search workflows…" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-9 h-9 bg-card border-border text-sm" />
          </div>
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button key={tab} onClick={() => handleTabChange(tab)} className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} onDelete={handleDelete} onDuplicate={handleDuplicate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <GitBranch className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {searchTerm || activeTab !== 'all' ? 'No workflows found' : 'No workflows yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {searchTerm || activeTab !== 'all' ? 'Adjust your search or filters.' : 'Create your first AI pipeline to get started.'}
            </p>
            {!searchTerm && activeTab === 'all' && (
              <div className="flex items-center gap-2">
                <Button onClick={handleLoadSample} variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20">
                  <Sparkles className="h-4 w-4 mr-2" /> Load Sample
                </Button>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Create Workflow
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
