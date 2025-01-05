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
  CarFront,
  ClipboardList,
  DollarSign,
  Menu,
  Package,
  Pencil,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExchangeRate } from "@/lib/types/general.types";
import { getExchangeRate } from "@/lib/actions/general";
import { CurrencyStatus } from "./currency-status";
import CustomCurrency from "./custom-currency";
import { useStringContext } from "./CurrencyProvider";
import Logo from "@/public/images/logo.webp";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { LogoutUser } from "@/lib/actions/auth";
// import { toast } from "react-toastify";

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
    key: "",
    href: "/",
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
        title: "Покупка топливо (соляркa)",
        href: "/warehouse/diesel",
      },
      {
        title: "Залить топливо (соляркa)",
        href: "/warehouse/diesel/diesel-fill",
      },
      {
        title: "Автозапчасти",
        href: "/auto-parts",
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
    icon: <CarFront />,
    key: "cars",
    href: "/cars",
  },
  {
    id: "7",
    title: "Приход и расход",
    icon: <DollarSign />,
    key: "expenses",
    children: [
      {
        title: "Добавить приход",
        href: "/expenses/income",
      },
      {
        title: "Добавить расход",
        href: "/expenses/outcome?id=PAY_SALARY",
      },
      {
        title: "История прихода и расхода",
        href: "/expenses",
      },
    ],
  },
  {
    id: "6",
    title: "Настройки",
    icon: <Settings />,
    key: "settings",
    href: "/settings",
  },
];

export let UsedCurrencies: ExchangeRate[] = []

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
  const { currencyStatus, setCurrencyStatus } = useStringContext();
  const [editStatus, setEditStatus] = useState(true)
  const pathname = usePathname();
  const { push } = useRouter();
  const { data: exchange } = useQuery<ExchangeRate[]>({
    queryKey: ["exchange"],
    queryFn: getExchangeRate,
  });
 const EXCHANGE_RATE = exchange?.filter((item) =>
    ["USD", "RUB", "KZT"]?.includes(item?.Ccy)
  );

  UsedCurrencies = EXCHANGE_RATE as ExchangeRate[]

  const handleLink = (item: MenuItem) => {
    setActiveSubItem(item.children as MenuItem[]);
    if (item?.children) {
      setSubItemStatus(true);
    } else {
      setSubItemStatus(false);
    }
  };
  const { mutate: logoutMutation } = useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      // toast.success("Успешно удалено!");
      push("/login");
    },
    onError: () => {
      // toast.error("Вы не можете удалить этот pейс!");
    },
  });
  const logOut = () => {
    logoutMutation()
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  };

  const handleReload = () => {
    window.location.reload()
  }
  return (
    <aside className="fixed top-0 left-0 h-full z-50">
      <Sidebar
        className={`${
          subItemStatus ? "w-[600px]" : " w-[300px]"
        } transition-none`}
        style={{ background: "transparent" }}
      >
        <SidebarContent
          className={`bg-transparent grid pr-3  ${
            subItemStatus ? "grid-cols-2" : ""
          }`}
        >
          <div className="bg-white shadow-lg w-full h-full justify-start flex flex-col gap-1">
            <div className="flex w-full mb-3 justify-start py-3 px-6 items-center gap-[90px]">
              <div className="text-[20px] font-[800] flex items-center">
                <Image src={Logo} alt="logo" width={100} height={100} />
                {/* <span>Track</span> */}
              </div>
              <div
                className="relative py-2  w-12 h-8 rounded-md px-3 hover:bg-slate-100 ease-linear duration-200"
                onClick={() => setSideBar((prev) => !prev)}
              >
                <SidebarTrigger className="absolute top-0 w-full h-full left-0 opacity-0" />
                <Menu size="icon" />
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
            <div className="h-full flex flex-col items-end justify-end p-6 gap-2">
              {editStatus && <Button size={"icon"} variant={"ghost"} onClick={()=>setEditStatus(prev=> !prev)}><Pencil/></Button>}
              <div className="flex items-center gap-3 justify-between w-full p-2 py-3 rounded-md border border-gray-300 text-sm">
                <span>{currencyStatus ? "Ручной ввод" : "Автоматический расчет"}</span>
                <Switch
                disabled={editStatus}
                  checked={currencyStatus}
                  onCheckedChange={() => {
                    localStorage.setItem(
                      "currencyStatus",
                      (!currencyStatus).toString()
                    );
                    // window.location.reload()
                    setCurrencyStatus(!currencyStatus);
                  }}
                />
              </div>
              {currencyStatus ? (
                <CustomCurrency status={editStatus}/>
              ) : (
                EXCHANGE_RATE?.map((rate, index) => (
                  <CurrencyStatus
                    key={index}
                    currency={rate?.Ccy as string}
                    value={rate?.Rate as string}
                    change={rate?.Diff as string}
                  />
                ))
              )}
              {!editStatus && <div className="flex justify-center w-full">
                <Button
                  onClick={handleReload}
                  className="w-full bg-[#4880FF] text-white hover:bg-blue-600"
                >
                  Сохранить
                </Button>
              </div>}
              <div className="flex justify-center w-full">
                <Button
                  onClick={logOut}
                  className="w-full bg-[#4880FF] text-white hover:bg-blue-600"
                >
                  Выйти
                </Button>
              </div>
            </div>
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
