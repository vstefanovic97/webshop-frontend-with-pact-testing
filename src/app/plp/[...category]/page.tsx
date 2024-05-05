import Filter from './components/Filter';
import Link from 'next/link';
import ProductTile, { type Product } from './components/ProductTile';
import styles from './page.module.css';

interface ProductFilters {
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  page: string;
  limit: string;
  categoryId: string;
}

async function getProducts(queryParams: ProductFilters): Promise<Product[]> {
  const productsUrlWithParams = new URL(
    'https://web-shop.dev/api/browse/products'
  );

  for (const [queryKey, queryValue] of Object.entries(queryParams)) {
    productsUrlWithParams.searchParams.append(queryKey, queryValue);
  }

  const res = await fetch(productsUrlWithParams);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

interface Props {
  params: { category: string[] };
  searchParams: Partial<Omit<ProductFilters, 'categoryId'>>;
}

export default async function PlpId({
  params: { category },
  searchParams,
}: Props) {
  const categoryId = category.at(-1) as string;
  const categoryName = category.slice(0, -1).join(' ');
  const products = await getProducts({
    page: '1',
    limit: '10',
    ...searchParams,
    categoryId,
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{categoryName}</h2>
      <Filter className={styles.filter} />
      <div className={styles.productList}>
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <ProductTile product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
