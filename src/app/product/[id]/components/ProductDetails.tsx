export interface Product {
  id: number;
  name: string;
  color: string;
  description: string;
  imageUrls: string[];
  price: string;
  inventory: boolean;
}

interface Props {
  product: Product;
  className: string;
}

export default function ProductDetails({
  product: { name, price, color },
  className,
}: Props) {
  return (
    <div className={className}>
      <h2>{name}</h2>
      <div>
        <span>Price:</span>
        <span>{price}</span>
      </div>
      <div>
        <span>Color:</span>
        <span style={{ color }}></span>
        <span>{color}</span>
      </div>
      <div>
        <h4>Details:</h4>
        <span style={{ color }}></span>
        <span>{color}</span>
      </div>
    </div>
  );
}
