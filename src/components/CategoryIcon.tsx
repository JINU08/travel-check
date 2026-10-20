import React from 'react';
import {
  ShieldCheck,
  Shirt,
  Droplets,
  Smartphone,
  HeartPulse,
  Package,
  Layers,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { CategoryId } from '../types';

interface CategoryIconProps extends LucideProps {
  categoryId?: CategoryId | 'all';
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, ...props }) => {
  switch (categoryId) {
    case 'essential':
      return <ShieldCheck {...props} />;
    case 'clothing':
      return <Shirt {...props} />;
    case 'toiletries':
      return <Droplets {...props} />;
    case 'electronics':
      return <Smartphone {...props} />;
    case 'health':
      return <HeartPulse {...props} />;
    case 'etc':
      return <Package {...props} />;
    case 'all':
    default:
      return <Layers {...props} />;
  }
};
