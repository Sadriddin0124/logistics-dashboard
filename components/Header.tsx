"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Key } from "lucide-react";
import { useRouter } from "next/router";
import { fetchMe } from "@/lib/actions/auth";
import { useQuery } from "@tanstack/react-query";
// import { PasswordChangeDialog } from "./auth/change-password";
import Breadcrumb from "./BreadCrumb";
import Image from "next/image";
import NotificationImage from "@/public/images/notification.png"
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const { push, pathname } = useRouter();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: pathname !== "/login"
  });
  
  return (
    <header className="bg-white shadow-sm w-full">
      {/* <PasswordChangeDialog setIsDialogOpen={setIsDialogOpen} isDialogOpen={isDialogOpen}/> */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Breadcrumb/>
        </div>
        <div className="w-[30px] h-[30px]">
          <Image src={NotificationImage} alt="notify" width={200} height={200} className="w-full h-full"/>
        </div>
        {!me && <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{me?.first_name.split(" ")[0].slice(0,1) || "A"}{me?.first_name.split(" ")[1]?.slice(0,1) || me?.first_name.split(" ")[0].slice(1,2)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{me?.first_name.split(" ")[0]}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {me?.first_name.split(" ")[1]}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem >
              <Key className="mr-2 h-4 w-4" />
              <span>Parolni o&apos;zgartirish</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              push("/login")
              localStorage.removeItem("accessToken")
              sessionStorage.removeItem("isLoggedIn")
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Chiqish</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>}
      </div>
    </header>
  );
}
