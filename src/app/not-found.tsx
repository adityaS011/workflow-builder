import Link from 'next/link'
import { SearchX, Home } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
          <SearchX className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
            <Home className="h-3.5 w-3.5" /> Go home
          </Button>
        </Link>
      </div>
    </div>
  )
}
