'use client';

import { useInView } from 'react-intersection-observer';
import ProductCard from './product-card';
import type { Product } from '@/lib/types';

type ProductListItemProps = {
  product: Product;
  index: number;
};

export default function ProductListItem({ product, index }: ProductListItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
    >
      <ProductCard product={product} />
    </div>
  );
}
