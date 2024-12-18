interface ICategory {
  id?: string;
  name_uz: string;
  name_ru: string;
  name_uk: string;
  active?: boolean;
  content_type?: string;
  children?: ICategory[];
  image: { id: string; file: string } | null;
}

// Rekursiv filter function
function filterCategories(
  categories: ICategory[],
  
  searchTerm: string,
  isActive: boolean | undefined
): ICategory[] {
  return categories
    .filter((category) => {
      // Check if any of the names match the search term
      const matchesSearch = [
        category.name_uz,
        category.name_ru,
        category.name_uk,
      ].some((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by active status, only if isActive is not undefined
      const matchesActiveStatus =
        isActive === undefined || category.active === isActive;

      return matchesSearch && matchesActiveStatus;
    })
    .map((category) => ({
      ...category,
      children: category.children
        ? filterCategories(category.children, searchTerm, isActive)
        : undefined, // Recursively filter children
    }))
    .filter((category) => category.children?.length || category.active); // Keep category if it has children or is active
}

// Test data
const categories: ICategory[] = [
  {
    id: "1",
    name_uz: "Kategoriya 1",
    name_ru: "Категория 1",
    name_uk: "Категорія 1",
    active: true,
    image: { id: "img1", file: "image1.jpg" },
    children: [
      {
        id: "1.1",
        name_uz: "Subkategoriya 1.1",
        name_ru: "Подкатегория 1.1",
        name_uk: "Підкатегорія 1.1",
        active: false,
        image: { id: "img2", file: "image2.jpg" },
        children: [],
      },
    ],
  },
  {
    id: "2",
    name_uz: "Kategoriya 2",
    name_ru: "Категория 2",
    name_uk: "Категорія 2",
    active: true,
    image: { id: "img3", file: "image3.jpg" },
    children: [],
  },
];

// Filtirni sinash
const filteredCategories = filterCategories(categories, "Kategoriya", true);
console.log(filteredCategories);

