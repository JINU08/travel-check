import type { ExpenseCategoryMeta, ExpenseItem, PaymentMethod } from '../types';
import { getTodayDateString, getFutureDateString } from '../utils/date';

export const EXPENSE_CATEGORIES: ExpenseCategoryMeta[] = [
  {
    id: 'transport',
    name: '교통비',
    color: '#0284c7', // Sky Blue
    icon: 'Plane',
    description: '항공권, KTX, 버스, 렌터카, 택시, 주유비 등',
  },
  {
    id: 'lodging',
    name: '숙박비',
    color: '#6366f1', // Indigo
    icon: 'Building2',
    description: '호텔, 리조트, 펜션, 게스트하우스 등',
  },
  {
    id: 'food',
    name: '식비',
    color: '#f59e0b', // Amber
    icon: 'UtensilsCrossed',
    description: '식당, 카페, 베이커리, 마트, 간식비 등',
  },
  {
    id: 'activity',
    name: '관광/체험',
    color: '#10b981', // Emerald
    icon: 'Ticket',
    description: '입장료, 투어 패키지, 액티비티 체험, 공연 등',
  },
  {
    id: 'shopping',
    name: '쇼핑',
    color: '#ec4899', // Pink
    icon: 'ShoppingBag',
    description: '기념품, 특산물, 면세품, 선물 등',
  },
  {
    id: 'etc',
    name: '기타',
    color: '#8b5cf6', // Violet
    icon: 'Receipt',
    description: '여행자 보험, 짐 보관, 비상금, 통신비 등',
  },
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: '카드' },
  { id: 'cash', label: '현금' },
  { id: 'transfer', label: '계좌이체' },
];

export const DEFAULT_BUDGET_AMOUNT = 800000; // 80만원 기본 총 예산

export const INITIAL_SAMPLE_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-init-1',
    category: 'transport',
    title: '왕복 항공권 예약',
    amount: 198000,
    date: getTodayDateString(),
    paymentMethod: 'card',
    memo: '얼리버드 특가 예매',
    createdAt: Date.now() - 3000,
  },
  {
    id: 'exp-init-2',
    category: 'lodging',
    title: '오션뷰 호텔 2박',
    amount: 240000,
    date: getTodayDateString(),
    paymentMethod: 'card',
    memo: '조식 포함 패키지',
    createdAt: Date.now() - 2000,
  },
  {
    id: 'exp-init-3',
    category: 'food',
    title: '흑돼지 구이 저녁 식사',
    amount: 72000,
    date: getFutureDateString(1),
    paymentMethod: 'card',
    memo: '현지 로컬 맛집',
    createdAt: Date.now() - 1000,
  },
];
