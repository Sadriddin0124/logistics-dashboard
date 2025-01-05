"use client";

import React from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface RussianAlertDialogProps {
  triggerText?: string;
  title?: string;
  description?: string;
  cancelText?: string;
  continueText?: string;
  onContinue?: () => void;
}

export function DeleteFlight({
  title = "Вы уверены?",
  description = "Это действие невозможно отменить. Это приведет к безвозвратному удалению ваших данных с наших серверов.",
  cancelText = "Отмена",
  continueText = "Продолжить",
  onContinue,
}: RussianAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md">
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#4880FF] text-white hover:bg-blue-600 rounded-md"
            onClick={onContinue}
          >
            {continueText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
