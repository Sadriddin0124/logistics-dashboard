import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Header from "../header/Header";
import { usePathname } from "next/navigation";
import Loading from "./loader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [sideBar, setSideBar] = useState<boolean>(false);
  const [subItemStatus, setSubItemStatus] = useState<boolean>(false);
  const [load, setLoad] = useState(false)
  setTimeout(() => {
    setLoad(false)
  }, 1000);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div
          className={`transition-all duration-300 overflow-hidden ${
            sideBar ? "hidden" : "block md:w-[287px] md:min-w-[287px]"
          }`}
        >
          {pathname !== "/login" && (
            <AppSidebar
              setSideBar={setSideBar}
              subItemStatus={subItemStatus}
              setSubItemStatus={setSubItemStatus}
            />
          )}
        </div>

        <SidebarInset className="flex-1 bg-slate-100 relative">
          {subItemStatus && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setSubItemStatus(false)}
            ></div>
          )}
          <div className="flex flex-col w-full gap-3">
            {pathname !== "/login" && (
              <div className="flex h-16 items-center gap-2 border-b">
                <Header setSideBar={setSideBar} sideBar={sideBar} />
              </div>
            )}
          </div>
          {load ? <Loading/> :
           ""}
           <main className={`${load ? "fixed z-[-1]" : ""} p-4`}>{children}</main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
