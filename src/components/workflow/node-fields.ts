import { NodeFieldDef } from '@/types/workflow'

const FIELDS_MAP: Record<string, NodeFieldDef[]> = {
  trigger: [
    {
      key: 'triggerType',
      label: 'Trigger Type',
      type: 'select',
      options: ['webhook', 'schedule', 'event'],
      placeholder: 'Select trigger type',
    },
    { key: 'eventName', label: 'Event / Path', type: 'text', placeholder: 'e.g. /webhook or user.signup' },
    { key: 'schedule', label: 'Cron Schedule', type: 'text', placeholder: '*/5 * * * *' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What starts this pipeline?' },
  ],
  llm: [
    {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      options: ['openai', 'anthropic', 'google', 'mistral'],
      placeholder: 'Select provider',
    },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. gpt-4o, claude-3-5-sonnet' },
    { key: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are a helpful assistant...' },
    { key: 'userPrompt', label: 'User Prompt', type: 'textarea', placeholder: 'Use {{variable}} to reference inputs' },
    { key: 'temperature', label: 'Temperature', type: 'number', placeholder: '0.7', step: 0.1, min: 0, max: 2 },
    { key: 'maxTokens', label: 'Max Tokens', type: 'number', placeholder: '1024', min: 1 },
  ],
  transform: [
    {
      key: 'transformType',
      label: 'Transform Type',
      type: 'select',
      options: ['json_parse', 'json_stringify', 'template', 'regex_extract', 'js_expression'],
      placeholder: 'Select transform',
    },
    { key: 'expression', label: 'Expression / Template', type: 'textarea', placeholder: '{{input.message}}' },
    { key: 'outputKey', label: 'Output Variable', type: 'text', placeholder: 'result' },
  ],
  condition: [
    {
      key: 'operator',
      label: 'Operator',
      type: 'select',
      options: ['equals', 'not_equals', 'contains', 'not_contains', 'gt', 'lt', 'gte', 'lte', 'is_empty'],
      placeholder: 'Select operator',
    },
    { key: 'property', label: 'Property Path', type: 'text', placeholder: 'e.g. output.sentiment' },
    { key: 'value', label: 'Value', type: 'text', placeholder: 'positive' },
    { key: 'trueLabel', label: 'True Branch Label', type: 'text', placeholder: 'Yes' },
    { key: 'falseLabel', label: 'False Branch Label', type: 'text', placeholder: 'No' },
  ],
  http: [
    {
      key: 'method',
      label: 'Method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      placeholder: 'Select method',
    },
    { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/data' },
    { key: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Authorization": "Bearer {{token}}"}' },
    { key: 'body', label: 'Body (JSON)', type: 'textarea', placeholder: '{"message": "{{input}}"}' },
    {
      key: 'authType',
      label: 'Auth Type',
      type: 'select',
      options: ['none', 'bearer', 'api_key', 'basic'],
      placeholder: 'None',
    },
  ],
  output: [
    {
      key: 'outputType',
      label: 'Output Type',
      type: 'select',
      options: ['return', 'slack', 'email', 'webhook', 'console'],
      placeholder: 'Select output type',
    },
    { key: 'message', label: 'Message / Template', type: 'textarea', placeholder: '{{llm.response}}' },
    { key: 'destination', label: 'Destination', type: 'text', placeholder: '#alerts or email@example.com' },
    { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/...' },
  ],
}

export function getNodeFields(type: string): NodeFieldDef[] {
  return FIELDS_MAP[type] ?? []
}
