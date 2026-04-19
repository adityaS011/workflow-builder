import { Webhook, Brain, Shuffle, GitBranch, Globe, Send, type LucideIcon } from 'lucide-react'

export interface NodeMeta {
  Icon: LucideIcon
  label: string
  color: string
  border: string
  bg: string
  dot: string
  handleColor: string
}

const META_MAP: Record<string, NodeMeta> = {
  trigger: {
    Icon: Webhook,
    label: 'Trigger',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    dot: 'bg-emerald-400',
    handleColor: '#34d399',
  },
  llm: {
    Icon: Brain,
    label: 'LLM',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    dot: 'bg-violet-400',
    handleColor: '#a78bfa',
  },
  transform: {
    Icon: Shuffle,
    label: 'Transform',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    dot: 'bg-sky-400',
    handleColor: '#38bdf8',
  },
  condition: {
    Icon: GitBranch,
    label: 'Condition',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    dot: 'bg-amber-400',
    handleColor: '#fbbf24',
  },
  http: {
    Icon: Globe,
    label: 'HTTP',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/5',
    dot: 'bg-orange-400',
    handleColor: '#fb923c',
  },
  output: {
    Icon: Send,
    label: 'Output',
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/5',
    dot: 'bg-rose-400',
    handleColor: '#fb7185',
  },
}

const FALLBACK: NodeMeta = {
  Icon: Brain,
  label: 'Node',
  color: 'text-muted-foreground',
  border: 'border-border',
  bg: 'bg-secondary/30',
  dot: 'bg-muted-foreground',
  handleColor: '#6b7280',
}

export function getNodeMeta(type: string): NodeMeta {
  return META_MAP[type] ?? FALLBACK
}
