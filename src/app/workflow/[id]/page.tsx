'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { WorkflowEditor } from '@/features/workflows/components/workflow-editor'
import { useWorkflowStore } from '@/features/workflows/store/workflow-store'

export default function WorkflowPage() {
  const params = useParams()
  const { setCurrentWorkflow, workflows } = useWorkflowStore()

  useEffect(() => {
    const workflow = workflows.find(w => w.id === params.id)
    if (workflow) {
      setCurrentWorkflow(workflow)
    }
  }, [params.id, workflows, setCurrentWorkflow])

  return <WorkflowEditor />
}
