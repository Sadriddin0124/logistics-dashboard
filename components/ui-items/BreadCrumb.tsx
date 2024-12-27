import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = () => {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter((segment) => segment);
  // const path = router.pathname.split("/")[1];
  const paths = [
    {
      key: "warehouse",
      value: "Склад",
    },
    {
      key: "gas",
      value: "Топливо (Газ)",
    },
    {
      key: "gas-info",
      value: "O Топливо (Газ)",
    },
    {
      key: "gas-other",
      value: "Заправка бензином на другой заправке",
    },
    {
      key: "gas-sold",
      value: "Реализация газа"
    },
    {
      key: "oil",
      value: "Масло для автомобилей",
    },
    {
      key: "oil-info",
      value: "O Масло для автомобилей",
    },
    {
      key: "oil-exchange",
      value: "Замена масла",
    },
    {
      key: "oil-recycled",
      value: "Лить масло",
    },
    {
      key: "diesel",
      value: "Дизель",
    },
    {
      key: "diesel-fill",
      value: "Дизельный впрыск",
    },
    {
      key: "settings",
      value: "Настройки",
    },
    {
      key: "flight",
      value: "Рейс",
    },
    {
      key: "flight-create",
      value: "Добавить рейс",
    },
    {
      key: "flight-info",
      value: "О рейсe",
    },
    {
      key: "flight-order",
      value: "Заказать Рейс",
    },
  ];

  const findLabel = (segment: string) => {
    // Check for dynamic segments like '[id]'
    const path = paths.find(
      (item) => item.key === segment || item.key === "[id]"
    );
    return path
      ? path.value
      : segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav aria-label="breadcrumb" className="w-full px-3">
      <ol className="breadcrumb flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-gray-500">
            Главная
          </Link>
          {pathSegments.length > 0 && <span> / </span>}
        </li>
        {pathSegments.map((segment, index) => {
          const path = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;
          const label = findLabel(segment); // Get the label for the breadcrumb

          return (
              label !== "Склад" &&
            <li key={path} className="inline-block">
              {!isLast ? (
                <>
                  <Link href={path} className="hover:text-gray-500">
                    {label}
                  </Link>
                  <span> / </span>
                </>
              ) : (
                <span>{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
