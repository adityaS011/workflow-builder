'use client'

import { GitBranch, Activity, Edit, type LucideIcon } from 'lucide-react'

interface Stat {
  label: string
  value: number
  Icon: LucideIcon
  color: string
}

interface StatsBarProps {
  total: number
  published: number
  draft: number
}

export function StatsBar({ total, published, draft }: StatsBarProps) {
  const stats: Stat[] = [
    { label: 'Total', value: total, Icon: GitBranch, color: 'text-primary' },
    { label: 'Published', value: published, Icon: Activity, color: 'text-emerald-400' },
    { label: 'Draft', value: draft, Icon: Edit, color: 'text-amber-400' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map(({ label, value, Icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div>
            <div className="text-xl font-semibold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
