import { Card } from '@/components/ui/card'

function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="gap-3 p-4">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-6 w-28" />
            <Shimmer className="h-3 w-20" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-80 p-5 lg:col-span-2">
          <Shimmer className="h-full w-full" />
        </Card>
        <Card className="h-80 p-5">
          <Shimmer className="h-full w-full" />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-72 p-5">
          <Shimmer className="h-full w-full" />
        </Card>
        <Card className="h-72 p-5">
          <Shimmer className="h-full w-full" />
        </Card>
      </div>
    </div>
  )
}
