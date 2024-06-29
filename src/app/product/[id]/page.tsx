import { notFound } from 'next/navigation';
import { axiosInstance } from '@/axios';
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

export async function getProduct(id: string | number): Promise<Product> {
  const response = await axiosInstance.get<Product>(
    `api/browse/products/${id}`
  );

  return response.data;
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
