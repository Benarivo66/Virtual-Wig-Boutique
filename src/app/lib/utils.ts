import { ProductField } from "./definitions"

export function getUniqueCategories(products: ProductField[]): string[] {
  const categories = products.map((product) => product.category)
  return [...new Set(categories)].sort()
}

export function getCategoriesFromPlaceholderData(
  products: ProductField[]
): string[] {
  return getUniqueCategories(products)
}

/**
 * Search products by multiple criteria
 * @param products - Array of products to search
 * @param query - Search query
 * @param searchFields - Fields to search in (default: name, description, category)
 * @returns Filtered products array
 */
export function searchProducts(
  products: ProductField[],
  query: string,
  searchFields: (keyof ProductField)[] = ["name", "description", "category"]
): ProductField[] {
  if (!query.trim()) return products

  const searchTerm = query.toLowerCase().trim()

  return products.filter((product) =>
    searchFields.some((field) => {
      const value = product[field]
      return (
        typeof value === "string" && value.toLowerCase().includes(searchTerm)
      )
    })
  )
}

/**
 * Filter products by category
 * @param products - Array of products to filter
 * @param category - Category to filter by
 * @returns Filtered products array
 */
export function filterProductsByCategory(
  products: ProductField[],
  category: string | null
): ProductField[] {
  if (!category) return products

  // Handle special "New Arrivals" category
  if (category.toLowerCase() === "new arrivals") {
    return products
      .filter((product) => (product.average_rating || 0) >= 4.5)
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
  }

  return products.filter((product) =>
    product.category.toLowerCase().includes(category.toLowerCase())
  )
}

/**
 * Get category counts for products
 * @param products - Array of products
 * @returns Object with category names as keys and counts as values
 */
export function getCategoryCounts(
  products: ProductField[]
): Record<string, number> {
  return products.reduce((counts, product) => {
    const category = product.category
    counts[category] = (counts[category] || 0) + 1
    return counts
  }, {} as Record<string, number>)
}

/**
 * Sort products by various criteria
 * @param products - Array of products to sort
 * @param sortBy - Sort criteria
 * @param order - Sort order (asc or desc)
 * @returns Sorted products array
 */
export function sortProducts(
  products: ProductField[],
  sortBy: "name" | "price" | "rating" | "category" = "name",
  order: "asc" | "desc" = "asc"
): ProductField[] {
  return [...products].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "price":
        aValue = a.price
        bValue = b.price
        break
      case "rating":
        aValue = a.average_rating || 0
        bValue = b.average_rating || 0
        break
      case "category":
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1
    if (aValue > bValue) return order === "asc" ? 1 : -1
    return 0
  })
}
