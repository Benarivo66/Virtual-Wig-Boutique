import postgres from "postgres"
import EditProductForm from "@/app/ui/EditProductForm"
import { Product } from "@/app/lib/definitions"
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const rows = await sql<Product[]>`
    SELECT * FROM products WHERE id = ${params.id}
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
