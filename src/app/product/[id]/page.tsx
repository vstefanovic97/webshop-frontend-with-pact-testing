import { notFound } from 'next/navigation';
import ImageShowCase from './components/ImageShowcase';
import ProductDetails from './components/ProductDetails';
import styles from './page.module.css';

export interface Product {
  id: number;
  name: string;
  color: string;
  description: string;
  imageUrls: string[];
  price: string;
  inventory: boolean;
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://web-shop.dev/api/browse/products/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <ImageShowCase className={styles.imageShowCase} images={product.imageUrls} />
      <ProductDetails className={styles.productDetails} product={product} />
    </div>
  );
}
