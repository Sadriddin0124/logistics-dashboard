"use client"

import { Bell, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from 'react'

interface Notification {
  id: string
  title: string
  time: string
  read: boolean
}

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New route assigned',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Cargo information updated',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      title: 'Schedule changed',
      time: '2 hours ago',
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-xs text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-2">
            {notifications.map((notification) =>
              !notification.read ? (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check />
                  </Button>
                </div>
              ) : null
            )}
            {notifications.filter((n) => !n.read).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notifications
              </p>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
