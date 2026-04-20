import { Workflow } from '@/types/workflow'
import { generateId } from '@/lib/utils'

export function createSampleWorkflow(): Workflow {
  const triggerId = generateId()
  const llmId = generateId()
  const transformId = generateId()
  const conditionId = generateId()
  const httpId = generateId()
  const outputId = generateId()

  return {
    id: generateId(),
    name: 'AI Support Ticket Triage',
    description: 'Classify incoming support tickets with GPT-4 and route urgent ones to Slack',
    tags: ['sample', 'support', 'ai-triage'],
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    nodes: [
      {
        id: triggerId,
        type: 'trigger',
        position: { x: 280, y: 40 },
        data: {
          label: 'New Ticket Webhook',
          config: {
            triggerType: 'webhook',
            eventName: '/webhook/support-ticket',
            description: 'Fires when a new ticket arrives',
          },
        },
      },
      {
        id: llmId,
        type: 'llm',
        position: { x: 280, y: 200 },
        data: {
          label: 'Classify Ticket',
          config: {
            provider: 'openai',
            model: 'gpt-4o',
            systemPrompt: 'You are a support triage agent. Classify tickets into: urgent, normal, low. Return JSON: {priority, category, summary}.',
            userPrompt: 'Ticket: {{trigger.body}}',
            temperature: '0.2',
            maxTokens: '300',
          },
        },
      },
      {
        id: transformId,
        type: 'transform',
        position: { x: 280, y: 360 },
        data: {
          label: 'Parse LLM JSON',
          config: {
            transformType: 'json_parse',
            expression: '{{llm.response}}',
            outputKey: 'classification',
          },
        },
      },
      {
        id: conditionId,
        type: 'condition',
        position: { x: 280, y: 520 },
        data: {
          label: 'Is Urgent?',
          config: {
            operator: 'equals',
            property: 'classification.priority',
            value: 'urgent',
            trueLabel: 'Urgent',
            falseLabel: 'Normal',
          },
        },
      },
      {
        id: httpId,
        type: 'http',
        position: { x: 280, y: 680 },
        data: {
          label: 'Create Jira Ticket',
          config: {
            method: 'POST',
            url: 'https://api.atlassian.com/rest/api/3/issue',
            headers: '{"Authorization": "Bearer {{secrets.JIRA_TOKEN}}", "Content-Type": "application/json"}',
            body: '{"summary": "{{classification.summary}}", "priority": "High"}',
            authType: 'bearer',
          },
        },
      },
      {
        id: outputId,
        type: 'output',
        position: { x: 280, y: 840 },
        data: {
          label: 'Alert Slack',
          config: {
            outputType: 'slack',
            message: '🚨 Urgent ticket: {{classification.summary}}',
            destination: '#customer-urgent',
            webhookUrl: 'https://hooks.slack.com/services/...',
          },
        },
      },
    ],
    edges: [
      { id: generateId(), source: triggerId, target: llmId, sourceHandle: 'bottom', targetHandle: 'top' },
      { id: generateId(), source: llmId, target: transformId, sourceHandle: 'bottom', targetHandle: 'top' },
      { id: generateId(), source: transformId, target: conditionId, sourceHandle: 'bottom', targetHandle: 'top' },
      { id: generateId(), source: conditionId, target: httpId, sourceHandle: 'bottom', targetHandle: 'top' },
      { id: generateId(), source: httpId, target: outputId, sourceHandle: 'bottom', targetHandle: 'top' },
    ],
  }
}
