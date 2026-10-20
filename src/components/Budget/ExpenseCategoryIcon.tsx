import React from 'react';
import {
  Plane,
  Building2,
  UtensilsCrossed,
  Ticket,
  ShoppingBag,
  Receipt,
  Wallet,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ExpenseCategory } from '../../types';

interface ExpenseCategoryIconProps extends LucideProps {
  category?: ExpenseCategory | 'all';
}

export const ExpenseCategoryIcon: React.FC<ExpenseCategoryIconProps> = ({
  category,
  ...props
}) => {
  switch (category) {
    case 'transport':
      return <Plane {...props} />;
    case 'lodging':
      return <Building2 {...props} />;
    case 'food':
      return <UtensilsCrossed {...props} />;
    case 'activity':
      return <Ticket {...props} />;
    case 'shopping':
      return <ShoppingBag {...props} />;
    case 'etc':
      return <Receipt {...props} />;
    case 'all':
    default:
      return <Wallet {...props} />;
  }
};
