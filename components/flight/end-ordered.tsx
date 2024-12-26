import { toast } from "react-toastify";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { updateOrderedStatus } from "@/lib/actions/flight.action";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import React from "react";
import { useRouter } from "next/router";

const EndOrderedFlight = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
    const { push } = useRouter()
  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateOrderedStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success("Рейс успешно завершён!");
      setOpen(false); // Close dialog after success
      push("/flight")
    },
    onError: () => {
      toast.error("Ошибка при завершении рейса!");
    },
  });

  const handleEnd = () => {
    updateMutation(id); // Ensure status is set to "completed"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md">
          Завершить рейс
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 p-6">
        <h3 className="text-lg font-medium">Вы уверены, что хотите завершить рейс?</h3>
        <div className="flex justify-end gap-4">
          <DialogTrigger asChild>
            <Button variant="outline" className="px-4 py-2">
              Отмена
            </Button>
          </DialogTrigger>
          <Button
            onClick={handleEnd}
            disabled={isPending}
            className="bg-[#4880FF] text-white hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            {isPending ? "Завершение..." : "Завершить рейс"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndOrderedFlight;
