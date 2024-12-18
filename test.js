var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
// Rekursiv filter function
function filterCategories(categories, searchTerm, isActive) {
  return categories
    .filter(function (category) {
      // Check if any of the names match the search term
      var matchesSearch = [
        category.name_uz,
        category.name_ru,
        category.name_uk,
      ].some(function (name) {
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      // Filter by active status, only if isActive is not undefined
      var matchesActiveStatus =
        isActive === undefined || category.active === isActive;
      return matchesSearch && matchesActiveStatus;
    })
    .map(function (category) {
      return __assign(__assign({}, category), {
        children: category.children
          ? filterCategories(category.children, searchTerm, isActive)
          : undefined,
      });
    })
    .filter(function (category) {
      var _a;
      return (
        ((_a = category.children) === null || _a === void 0
          ? void 0
          : _a.length) || category.active
      );
    }); // Keep category if it has children or is active
}
// Test data
var categories = [
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
var filteredCategories = filterCategories(categories, "2", true);
console.log(filteredCategories);


