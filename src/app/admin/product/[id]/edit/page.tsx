import EditProductForm from "@/app/ui/EditProductForm"
import { Product } from "@/app/lib/definitions"
import { sql } from "@/app/lib/db";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const rows = await sql<Product[]>`
    SELECT * FROM products WHERE id = ${(await params).id}
  `

  const product = rows[0]

  if (!product) {
    return <p>Product not found</p>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <EditProductForm
        product={product}
      />
    </div>
  )
}
