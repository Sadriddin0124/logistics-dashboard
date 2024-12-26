import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon } from 'lucide-react'
import { Button } from "../ui/button"
import { downloadExcelFile } from "@/lib/functions"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon,
  url?: string
  url2?: string
}

export function StatCard({ title, value, icon: Icon, url, url2 }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {url2 ? <Button variant={"ghost"} size={"sm"} onClick={()=>downloadExcelFile(url as string)}>распроданный</Button> : <Icon className="h-4 w-4 text-muted-foreground mr-2" />}
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        <div className="text-xl font-bold">{value}</div>
        {url && <Button variant={"ghost"} size={"sm"} onClick={()=>downloadExcelFile(url as string)}>куплен</Button>}
      </CardContent>
    </Card>
  )
}

