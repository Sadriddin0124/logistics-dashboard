"use client"; // Ensures the component is rendered client-side

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";

interface DeleteAlertDialogProps {
  onDelete: (id: string) => void; // The function to delete an item using its id
  id: string; // The id of the item to delete
  title?: string; // Optional title for the confirmation dialog
  description?: string;
  type: string; // Optional description for the confirmation dialog
  total: number
}

export function ForceDeleteDialog({
  onDelete,
  id,
  type,
  total,
  title = "Сумма не равна 0", // Default title
}: DeleteAlertDialogProps) {
    const [checked, setChecked] = React.useState<boolean>(total == 0 ? true : false)
    console.log(total);
    console.log(checked);
    
  return (
    <AlertDialog>
      {/* Trigger for opening the confirmation dialog */}
      <AlertDialogTrigger asChild>
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px]">
          Удалить
          </Button>
      </AlertDialogTrigger>

      {/* The actual dialog content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
            <div className="flex items-center gap-2">
                <Checkbox id="check" checked={checked} onCheckedChange={()=>setChecked(prev=> !prev)}/>
                <label htmlFor="check">{type}</label>
            </div>
        {/* Footer with action buttons */}
        <AlertDialogFooter>
          <AlertDialogCancel>Назад</AlertDialogCancel>
          <AlertDialogAction
          disabled={!checked}
            onClick={() => onDelete(id)} // Call onDelete with the id
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
