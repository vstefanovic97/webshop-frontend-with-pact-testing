'use client';

import { useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRanger, Ranger } from '@tanstack/react-ranger';
import styles from './PriceFilter.module.css';

const ProductFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rangerRef = useRef<HTMLDivElement>(null);
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 10000;
  const values = [minPrice, maxPrice] as const;

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values,
    min: 0,
    max: 10000,
    stepSize: 1,
    onChange: (instance: Ranger<HTMLDivElement>) =>
      handlePriceChange(instance.sortedValues as [number, number]),
  });

  const handlePriceChange = ([minPrice, maxPrice]: readonly [number, number]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', String(minPrice));
    params.set('maxPrice', String(maxPrice));

    const url = `${pathname}?${params.toString()}`;

    router.replace(url);
  };

  return (
    <div>
      <h4 className={styles.heading}>Prices</h4>
      <div
        ref={rangerRef}
        style={{
          position: 'relative',
          userSelect: 'none',
          height: '4px',
          background: '#ddd',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)',
          borderRadius: '2px',
        }}
      >
        {rangerInstance
          .handles()
          .map(
            (
              {
                value,
                onKeyDownHandler,
                onMouseDownHandler,
                onTouchStart,
                isActive,
              },
              i
            ) => (
              <button
                key={i}
                onKeyDown={onKeyDownHandler}
                onMouseDown={onMouseDownHandler}
                onTouchStart={onTouchStart}
                role="slider"
                aria-valuemin={rangerInstance.options.min}
                aria-valuemax={rangerInstance.options.max}
                aria-valuenow={value}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${rangerInstance.getPercentageForValue(value)}%`,
                  zIndex: isActive ? '1' : '0',
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  outline: 'none',
                  borderRadius: '100%',
                  background: 'linear-gradient(to bottom, #eee 45%, #ddd 55%)',
                  border: 'solid 1px #888',
                }}
              />
            )
          )}
      </div>
    </div>
  );
};

export default ProductFilter;
