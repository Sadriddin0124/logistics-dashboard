"use client"

import { Bell, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchNotification, patchNotification } from '@/lib/actions/notification.action'
import { queryClient } from '../ui-items/ReactQueryProvider'
import { toast } from 'react-toastify'

interface Notification {
  id?: string
  message: string
  created_at: string
  is_read: boolean
}

export default function NotificationsPopover() {
  const { data: notification } = useQuery<Notification[]>({
    queryKey: ["notification"],
    queryFn: fetchNotification,
  });

  const unreadCount = notification?.filter((n) => !n.is_read).length
  const { mutate: updateMutation } = useMutation({
    mutationFn: patchNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
    onError: () => {
      toast.error("Не удалось пометить сообщение!");
    },
  });
  const markAsRead = (id: string) => {
    updateMutation(id)
  }

  const calculateTimeAgo = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const difference = Math.floor((now.getTime() - createdDate.getTime()) / 1000); // in seconds

    if (difference < 60) return "Прямо сейчас";
    if (difference < 3600) return `${Math.floor(difference / 60)} минут назад`;
    if (difference < 86400) return `${Math.floor(difference / 3600)}часов назад`;
    return createdDate.toLocaleDateString(); // Format as date
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-xs text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-base">Уведомления</CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-2">
            {notification?.map((notification) =>
              !notification.is_read ? (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{calculateTimeAgo(notification?.created_at)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => markAsRead(notification?.id as string)}
                  >
                    <Check />
                  </Button>
                </div>
              ) : null
            )}
            {notification?.filter((n) => !n.is_read).length === 0 && (
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
