"use client";

import { Dispatch, SetStateAction } from "react";
// import { PasswordChangeDialog } from "./auth/change-password";
import Breadcrumb from "../ui-items/BreadCrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Menu } from "lucide-react";
import NotificationsPopover from "./notifications";
export default function Header({
  setSideBar,
  sideBar,
}: {
  setSideBar: Dispatch<SetStateAction<boolean>>;
  sideBar: boolean;
}) {
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  return (
    <header className="bg-white shadow-sm w-full hidden sm:block">
      {/* <PasswordChangeDialog setIsDialogOpen={setIsDialogOpen} isDialogOpen={isDialogOpen}/> */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`py-2 w-12 h-8 rounded-md px-3 hover:bg-slate-100 ease-linear duration-200 relative ${
              sideBar ? "" : "md:hidden"
            }`}
            onClick={() => setSideBar((prev) => !prev)}
          >
            <Menu size="icon" />
            <SidebarTrigger className="absolute top-0 w-full h-full left-0 opacity-0" />
          </div>
          <Breadcrumb />
        </div>
        <div className="flex gap-3 items-center">
          <NotificationsPopover />
        </div>
      </div>
    </header>
  );
}
