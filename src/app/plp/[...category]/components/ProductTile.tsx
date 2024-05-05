import styles from './ProductTile.module.css';

export interface Product {
  id: number;
  name: string;
  color: string;
  description: string;
  imageUrls: string;
  price: string;
  inventory: boolean;
}

interface Props {
  product: Product;
}

export default function ProductTile({ product }: Props) {
  return <div className={styles.tile}>
    <img className={styles.mainImage} src={product.imageUrls[0]}></img>
    <img className={styles.hoverImage} src={product.imageUrls[1]}></img>
    <p className={styles.name}>{product.name}</p>
    <p className={styles.price}>${product.price}</p>
  </div>;
}
