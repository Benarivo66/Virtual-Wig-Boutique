import { fetchProducts } from '@/app/lib/data';
import ProductsPage from '@/app/ui/products';

export default async function Page() {
  const products = await fetchProducts();
  return <ProductsPage products={products} />;
}
