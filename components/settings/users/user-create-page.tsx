"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUser, PaginatedUser } from "@/lib/types/user.types";
import { UserTable } from "./user-table";
import { UserModal } from "./user-modal";
import { AlertDialog } from "./alert-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, fetchUser, updateUser } from "@/lib/actions/user.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: users_data } = useQuery<PaginatedUser>({
    queryKey: ["users_data", currentPage],
    queryFn: () => fetchUser(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["users_data", currentPage + 1],
      queryFn: () => fetchUser(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((users_data?.count as number) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 1) return buttons;
    buttons.push(1);
    if (currentPage > 3) {
      buttons.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(i);
    }
    if (currentPage < totalPages - 2) {
      buttons.push("...");
    }
    buttons.push(totalPages);
    return buttons;
  };
  const buttons = getPaginationButtons();
  const { mutate: createMutation } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_data", currentPage] });
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_data", currentPage] });
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: IUser) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };

  const handleSaveUser = (user: IUser) => {
    if (user.id) {
      updateMutation(user);
    } else {
      createMutation(user);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
    }
    setIsAlertOpen(false);
  };
 
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between w-full">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>
      <Button onClick={handleAddUser} className="mb-4 bg-blue-500 hover:bg-blue-600">
        Добавить пользователя
      </Button>
      </div>
      <div>
        <UserTable
          users={users_data?.results as IUser[]}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
        <div className="mt-4 flex justify-between items-center">
          <div>
            Итого: {users_data?.count || 0} с {indexOfFirstOrder + 1} до{" "}
            {Math.min(indexOfLastOrder, users_data?.count as number) || 0}
          </div>
          <div className="flex space-x-2 items-center">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="sr-only">Предыдущая страница</span>
            </Button>
            {buttons.map((button, index) =>
              button === "..." ? (
                <span key={index} style={{ margin: "0 5px" }}>
                  ...
                </span>
              ) : (
                <Button
                  key={index}
                  onClick={() => handlePageChange(button as number)}
                  disabled={button === currentPage}
                  className={
                    button === currentPage
                      ? "bg-[#4880FF] text-white"
                      : "border"
                  }
                  variant={button === currentPage ? "default" : "ghost"}
                >
                  {button || ""}
                </Button>
              )
            )}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0"
            >
              <ChevronRightIcon className="w-4 h-4" />
              <span className="sr-only">Следующая страница</span>
            </Button>
          </div>
        </div>
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
      />
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удалить пользователя"
        description="Вы уверены, что хотите удалить этого пользователя? Это действие нельзя будет отменить."
      />
    </div>
  );
}
