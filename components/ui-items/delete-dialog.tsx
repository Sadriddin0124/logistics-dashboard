"use client"  // Ensures the component is rendered client-side

import * as React from "react"
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteAlertDialogProps {
  onDelete: (id: string) => void  // The function to delete an item using its id
  id: string                     // The id of the item to delete
  title?: string                 // Optional title for the confirmation dialog
  description?: string           // Optional description for the confirmation dialog
}

export function DeleteAlertDialog({
  onDelete,
  id,
  title = "Вы абсолютно уверены?",   // Default title
  description = "Это действие невозможно отменить. Это приведет к безвозвратному удалению элемента и его удалению с наших серверов.",  // Default description
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog>
      {/* Trigger for opening the confirmation dialog */}
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" /> {/* Trash icon */}
        </Button>
      </AlertDialogTrigger>
      
      {/* The actual dialog content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        {/* Footer with action buttons */}
        <AlertDialogFooter>
          <AlertDialogCancel>Qaytish</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onDelete(id)} // Call onDelete with the id
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            O'chirish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
