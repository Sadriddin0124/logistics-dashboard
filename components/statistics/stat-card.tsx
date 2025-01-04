import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, type LucideIcon } from 'lucide-react'
import { Button } from "../ui/button"
import { downloadExcelFile } from "@/lib/functions"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon,
  url?: string
  url2?: string
  status?: boolean
  name?: string
  title1?: string
  title2?: string
}

export function StatCard({ title, value, icon: Icon, url, url2, name, title1, title2 }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {url2 ? <Button variant={"ghost"} size={"sm"} onClick={()=>downloadExcelFile(url2 as string, name as string)}>{ title1 ? title1 : <Download className="h-4 w-4 text-muted-foreground" size={"icon"} />}</Button> : <Icon className="h-4 w-4 text-muted-foreground mr-2" />}
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        <div className="text-lg font-bold">{value}</div>
        {url && <Button variant={"ghost"} size={"sm"} onClick={()=>downloadExcelFile(url as string, name as string)}>{ title1 ? title2 : <Download className="h-4 w-4 text-muted-foreground" size={"icon"} />}</Button>}
      </CardContent>
    </Card>
  )
}

