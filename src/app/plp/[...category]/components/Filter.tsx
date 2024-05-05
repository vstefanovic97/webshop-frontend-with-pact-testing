import ColorFilter from './ColorFilter';
import PriceFilter from './PriceFilter';
import styles from './Filter.module.css';

const ProductFilter = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <h3 className={styles.heading}>Quick Filters:</h3>
      <ColorFilter className={styles.colorFilter} />
      <PriceFilter />
    </div>
  );
};

export default ProductFilter;
