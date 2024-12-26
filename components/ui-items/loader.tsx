import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}

