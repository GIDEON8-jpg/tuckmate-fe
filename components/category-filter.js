export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {category === "all" ? "All Items" : category}
          </button>
        ))}
      </div>
    </div>
  )
}

