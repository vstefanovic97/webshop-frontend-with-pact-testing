'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './ColorFilter.module.css';

const colors = [
  'blue',
  'red',
  'yellow',
  'green',
  'purple',
  'orange',
  'brown',
  'white',
  'black',
];

const ProductFilter = ({ className }: { className: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    paramName: string,
    paramValue: string
  ) => {
    const { checked } = e.target;

    const params = new URLSearchParams(searchParams.toString());

    const targetParam = params.get(paramName) ?? '';
    if (checked) {
      const targetParamsWithNewValue = [
        ...targetParam.split(','),
        paramValue,
      ].join(',');
      params.set(paramName, targetParamsWithNewValue);
    } else {
      const targetParamsWithoutOldValue = targetParam
        .split(',')
        .filter((value) => value !== paramValue)
        .join(',');
      params.set(paramName, targetParamsWithoutOldValue);
    }

    const url = `${pathname}?${params.toString()}`;

    router.replace(url, { scroll: false});
  };

  return (
    <div className={`${styles.colorFilter} ${className}`}>
      <h4 className={styles.heading}>Colors</h4>
      {colors.map((color, index) => (
        <label className={styles.label} key={index}>
          <input
            type="checkbox"
            value={color}
            checked={searchParams.get('color')?.includes(color)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFilterChange(e, 'color', color)
            }
          />
          {color}
        </label>
      ))}
    </div>
  );
};

export default ProductFilter;
