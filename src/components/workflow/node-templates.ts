import { Webhook, Brain, Shuffle, GitBranch, Globe, Send, type LucideIcon } from 'lucide-react'

export interface SidebarNodeTemplate {
  type: string
  name: string
  description: string
  Icon: LucideIcon
  category: string
  color: string
  accent: string
}

export const NODE_TEMPLATES: SidebarNodeTemplate[] = [
  {
    type: 'trigger',
    name: 'Trigger',
    description: 'Start the pipeline on a webhook, schedule, or event',
    Icon: Webhook,
    category: 'Input',
    color: 'text-emerald-400',
    accent: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    type: 'llm',
    name: 'LLM Call',
    description: 'Call an AI model with a prompt and get a response',
    Icon: Brain,
    category: 'AI',
    color: 'text-violet-400',
    accent: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    type: 'transform',
    name: 'Transform',
    description: 'Parse, format, or reshape data between steps',
    Icon: Shuffle,
    category: 'Logic',
    color: 'text-sky-400',
    accent: 'bg-sky-500/10 border-sky-500/20',
  },
  {
    type: 'condition',
    name: 'Condition',
    description: 'Branch the flow with if/else logic',
    Icon: GitBranch,
    category: 'Logic',
    color: 'text-amber-400',
    accent: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    type: 'http',
    name: 'HTTP Request',
    description: 'Call an external API or webhook',
    Icon: Globe,
    category: 'Integration',
    color: 'text-orange-400',
    accent: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    type: 'output',
    name: 'Output',
    description: 'Return a response, send a message, or trigger an action',
    Icon: Send,
    category: 'Output',
    color: 'text-rose-400',
    accent: 'bg-rose-500/10 border-rose-500/20',
  },
]

export const SIDEBAR_CATEGORIES = ['All', 'Input', 'AI', 'Logic', 'Integration', 'Output']
