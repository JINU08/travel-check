export type TripType = 'domestic' | 'international';

export interface TripInfo {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripType: TripType;
}

export type CategoryId =
  | 'essential'
  | 'clothing'
  | 'toiletries'
  | 'electronics'
  | 'health'
  | 'etc';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  completed: boolean;
  isCustom?: boolean;
  createdAt: number;
}

export type StatusFilter = 'all' | 'uncompleted' | 'completed';

export interface ChecklistStats {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
}

// ---------------------------------------------------------------------------
// 여행 예산 관리 (Budget & Expense) 관련 타입
// ---------------------------------------------------------------------------
export type ExpenseCategory =
  | 'transport' // 교통비
  | 'lodging'   // 숙박비
  | 'food'      // 식비
  | 'activity'  // 관광/액티비티
  | 'shopping'  // 쇼핑
  | 'etc';      // 기타

export type PaymentMethod = 'card' | 'cash' | 'transfer';

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  memo?: string;
  createdAt: number;
}

export interface BudgetInfo {
  totalBudget: number;
}

export interface ExpenseCategoryMeta {
  id: ExpenseCategory;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface CategoryExpenseStat {
  category: ExpenseCategory;
  name: string;
  color: string;
  totalAmount: number;
  percentage: number;
  count: number;
}

export type MainTab = 'checklist' | 'budget';
