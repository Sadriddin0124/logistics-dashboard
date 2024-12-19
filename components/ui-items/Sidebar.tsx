import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  // SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart2,
  ClipboardList,
  Menu,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

type MenuItem = {
  id?: string;
  title: string;
  icon?: ReactNode;
  href?: string;
  children?: MenuItem[];
  key?: string;
};

const menuItems: MenuItem[] = [
  {
    id: "1",
    title: "Отчеты",
    icon: <BarChart2 />,
    key: "report",
  },
  {
    id: "2",
    title: "Склад",
    icon: <Package />,
    key: "warehouse",
    children: [
      {
        title: "Топливо (Газ)",
        href: "/warehouse/gas",
      },
      {
        title: "Масло для автомобилей",
        href: "/warehouse/oil",
      },
      {
        title: "Топливо (Саларка)",
        href: "/warehouse/diesel",
      },
    ],
  },
  {
    id: "3",
    title: "Рейсы",
    icon: <ClipboardList />,
    key: "flight",
    href: "/flight",
  },
  {
    id: "4",
    title: "Сотрудники",
    icon: <Users />,
    key: "employees",
    href: "/employees",
  },
  {
    id: "5",
    title: "Техники",
    icon: <Settings />,
    key: "cars",
    href: "/cars",
  },
];

interface SideBarProps {
  setSubItemStatus: Dispatch<SetStateAction<boolean>>;
  setSideBar: Dispatch<SetStateAction<boolean>>;
  subItemStatus: boolean;
}

export const AppSidebar: React.FC<SideBarProps> = ({
  setSideBar,
  setSubItemStatus,
  subItemStatus,
}) => {
  const [activeSubItem, setActiveSubItem] = useState<MenuItem[]>([]);
  const pathname = usePathname();
  const handleLink = (item: MenuItem) => {
    setActiveSubItem(item.children as MenuItem[]);
    if (item?.children) {
      setSubItemStatus(true);
    } else {
      setSubItemStatus(false);
    }
  };
  return (
    <aside className="fixed top-0 left-0 h-full z-50">
      <Sidebar
        className={`${
          subItemStatus ? "w-[600px]" : " w-[310px]"
        } transition-none`}
        style={{ background: "transparent" }}
      >
        <SidebarContent
          className={`bg-transparent grid pr-3  ${
            subItemStatus ? "grid-cols-2" : ""
          }`}
        >
          <div className="bg-white shadow-lg w-full h-full flex flex-col gap-1">
            <div className="flex w-full mb-3 justify-start py-3 px-6 items-center gap-[100px]">
              <div className="text-[20px] font-[800] flex items-center">
                <span className="text-[#4880FF]">Logi</span>
                <span>Track</span>
              </div>
              <div
                className="relative py-2  w-12 h-8 rounded-md px-3 hover:bg-slate-100 ease-linear duration-200"
                onClick={() => setSideBar((prev) => !prev)}
              >
            <SidebarTrigger className="absolute top-0 w-full h-full left-0 opacity-0" />
            <Menu size="icon"/>
              </div>
            </div>
            {menuItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex group cursor-pointer w-full relative justify-center"
                >
                  {pathname.split("/")[1] === item?.key && (
                    <div className="rounded-r-xl absolute w-2 h-full bg-[#4880FF] left-0"></div>
                  )}
                  <Link
                    href={item?.href || ""}
                    className={`${
                      pathname.split("/")[1] === item?.key
                        ? " bg-[#4880FF] text-white"
                        : "text-black hover:bg-slate-100 "
                    } py-3 flex items-end gap-2 rounded-[8px] pl-3 w-[80%]`}
                    onClick={() => handleLink(item as MenuItem)}
                  >
                    {item.icon}
                    {item?.title}
                  </Link>
                </div>
              );
            })}
          </div>
          {subItemStatus && (
            <div className="bg-white rounded-xl box_shadow p-8 overflow-hidden w-full h-[80%] mt-[30%] flex flex-col gap-1">
              {activeSubItem?.map((item, index) => {
                return (
                  <Link
                    href={item.href || ""}
                    key={index}
                    className={`${
                      pathname === item?.href
                        ? "text-[#4880FF] font-bold bg-[#487fff36]"
                        : ""
                    } hover:text-[#4880FF] hover:font-bold rounded-[4px] text-[14px] hover:bg-[#487fff36] py-3 px-4 text`}
                    onClick={() => setSubItemStatus(false)}
                  >
                    {item?.title}
                  </Link>
                );
              })}
            </div>
          )}
        </SidebarContent>
        {/* <div className="w-full h-full bg-black  left-[0px] z-[200]">ergeg</div> */}
      </Sidebar>
    </aside>
  );
};
