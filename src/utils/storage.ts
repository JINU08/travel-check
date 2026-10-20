import type { ChecklistItem, TripInfo, StatusFilter, CategoryId, BudgetInfo, ExpenseItem } from '../types';
import { generateDefaultItems } from '../data/defaultItems';
import { DEFAULT_BUDGET_AMOUNT, INITIAL_SAMPLE_EXPENSES } from '../data/expenseCategories';
import { getTodayDateString, getFutureDateString } from './date';

const STORAGE_KEYS = {
  TRIP_INFO: 'travel_check_trip_info_v1',
  CHECKLIST_ITEMS: 'travel_check_items_v1',
  CATEGORY_FILTER: 'travel_check_cat_filter_v1',
  STATUS_FILTER: 'travel_check_status_filter_v1',
  BUDGET_INFO: 'travel_check_budget_info_v1',
  EXPENSES: 'travel_check_expenses_v1',
};

export const DEFAULT_TRIP_INFO: TripInfo = {
  title: '설레는 제주 힐링 여행',
  destination: '제주도',
  startDate: getTodayDateString(),
  endDate: getFutureDateString(3),
  tripType: 'domestic',
};

export const DEFAULT_BUDGET_INFO: BudgetInfo = {
  totalBudget: DEFAULT_BUDGET_AMOUNT,
};

/**
 * 금액을 한국어 원화 포맷으로 변환 (예: 150000 -> 150,000원)
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ko-KR')}원`;
};

/**
 * 안전한 LocalStorage 읽기 함수 (예외 처리 포함)
 */
export const getStoredData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[LocalStorage] Failed to read key "${key}":`, error);
    return fallback;
  }
};

/**
 * 안전한 LocalStorage 쓰기 함수 (예외 처리 포함)
 */
export const setStoredData = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[LocalStorage] Failed to save key "${key}":`, error);
    return false;
  }
};

// 여행 정보 로드 & 저장
export const loadTripInfo = (): TripInfo => {
  return getStoredData<TripInfo>(STORAGE_KEYS.TRIP_INFO, DEFAULT_TRIP_INFO);
};

export const saveTripInfo = (tripInfo: TripInfo): boolean => {
  return setStoredData(STORAGE_KEYS.TRIP_INFO, tripInfo);
};

// 체크리스트 아이템 로드 & 저장
export const loadChecklistItems = (fallbackTripType: TripInfo['tripType'] = 'domestic'): ChecklistItem[] => {
  const stored = getStoredData<ChecklistItem[] | null>(STORAGE_KEYS.CHECKLIST_ITEMS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const defaultItems = generateDefaultItems(fallbackTripType);
  saveChecklistItems(defaultItems);
  return defaultItems;
};

export const saveChecklistItems = (items: ChecklistItem[]): boolean => {
  return setStoredData(STORAGE_KEYS.CHECKLIST_ITEMS, items);
};

// 필터 상태 로드 & 저장
export const loadFilterState = (): {
  category: 'all' | CategoryId;
  status: StatusFilter;
} => {
  const category = getStoredData<'all' | CategoryId>(STORAGE_KEYS.CATEGORY_FILTER, 'all');
  const status = getStoredData<StatusFilter>(STORAGE_KEYS.STATUS_FILTER, 'all');
  return { category, status };
};

export const saveFilterState = (
  category: 'all' | CategoryId,
  status: StatusFilter
): void => {
  setStoredData(STORAGE_KEYS.CATEGORY_FILTER, category);
  setStoredData(STORAGE_KEYS.STATUS_FILTER, status);
};

// 예산 정보 로드 & 저장
export const loadBudgetInfo = (): BudgetInfo => {
  return getStoredData<BudgetInfo>(STORAGE_KEYS.BUDGET_INFO, DEFAULT_BUDGET_INFO);
};

export const saveBudgetInfo = (budgetInfo: BudgetInfo): boolean => {
  return setStoredData(STORAGE_KEYS.BUDGET_INFO, budgetInfo);
};

// 지출 내역 로드 & 저장
export const loadExpenses = (): ExpenseItem[] => {
  const stored = getStoredData<ExpenseItem[] | null>(STORAGE_KEYS.EXPENSES, null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  // 기본 샘플 지출 내역 초기 설정
  saveExpenses(INITIAL_SAMPLE_EXPENSES);
  return INITIAL_SAMPLE_EXPENSES;
};

export const saveExpenses = (expenses: ExpenseItem[]): boolean => {
  return setStoredData(STORAGE_KEYS.EXPENSES, expenses);
};
