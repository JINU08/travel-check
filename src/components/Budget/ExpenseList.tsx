import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Trash2,
  Edit3,
  Calendar,
  CreditCard,
  Banknote,
  Send,
  SlidersHorizontal,
  Inbox,
} from 'lucide-react';
import type { ExpenseCategory, ExpenseItem, PaymentMethod } from '../../types';
import { EXPENSE_CATEGORIES } from '../../data/expenseCategories';
import { formatCurrency } from '../../utils/storage';
import { formatKoreanDate } from '../../utils/date';
import { ExpenseCategoryIcon } from './ExpenseCategoryIcon';

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onEditExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (expense: ExpenseItem) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter & sort
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchMemo = item.memo ? item.memo.toLowerCase().includes(q) : false;
          return matchTitle || matchMemo;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        // date-desc default
        return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
      });
  }, [expenses, selectedCategory, searchQuery, sortBy]);

  // Filtered total sum
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 1 - 1);
  }, [filteredExpenses]);

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return <CreditCard size={12} />;
      case 'cash':
        return <Banknote size={12} />;
      case 'transfer':
        return <Send size={12} />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return '카드';
      case 'cash':
        return '현금';
      case 'transfer':
        return '계좌이체';
    }
  };

  const getCategoryMeta = (catId: ExpenseCategory) => {
    return (
      EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
        name: '기타',
        color: '#6366f1',
      }
    );
  };

  return (
    <section className="expense-list-section" aria-label="지출 내역 목록">
      {/* Category filter tabs */}
      <div className="expense-filter-tabs-wrap">
        <div className="expense-category-pills">
          <button
            type="button"
            className={`exp-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <ExpenseCategoryIcon category="all" size={15} />
            <span>전체</span>
            <span className="exp-count-badge">{expenses.length}</span>
          </button>

          {EXPENSE_CATEGORIES.map((cat) => {
            const count = expenses.filter((e) => e.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                className={`exp-cat-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <ExpenseCategoryIcon category={cat.id} size={15} />
                <span>{cat.name}</span>
                <span className="exp-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="expense-controls-row">
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="지출 항목명 또는 메모 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sort-select-wrapper">
          <SlidersHorizontal size={14} className="sort-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date-desc">최신 날짜순</option>
            <option value="amount-desc">금액 높은순</option>
            <option value="amount-asc">금액 낮은순</option>
          </select>
        </div>
      </div>

      {/* Subtotal Banner for Active Filter */}
      <div className="expense-list-summary-bar">
        <span className="summary-count">
          총 <strong>{filteredExpenses.length}</strong>건의 지출 내역
        </span>
        <span className="summary-total">
          합계: <strong>{formatCurrency(filteredTotal)}</strong>
        </span>
      </div>

      {/* Expense Items List */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <Inbox size={40} />
          </div>
          <h4 className="empty-title">기록된 지출 내역이 없습니다</h4>
          <p className="empty-description">
            {searchQuery
              ? `'${searchQuery}' 검색어와 일치하는 지출 내역이 없습니다.`
              : selectedCategory !== 'all'
              ? `${getCategoryMeta(selectedCategory).name} 카테고리에 등록된 지출 내역이 없습니다.`
              : '상단의 입력 폼을 통해 교통비, 숙박비, 식비 등을 기록해 보세요!'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              className="btn-reset-filter"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              필터 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="expense-items-card-list">
          {filteredExpenses.map((expense) => {
            const catMeta = getCategoryMeta(expense.category);

            return (
              <div key={expense.id} className="expense-item-card">
                <div className="expense-item-left">
                  <div
                    className="expense-item-cat-icon"
                    style={{
                      backgroundColor: `${catMeta.color}15`,
                      color: catMeta.color,
                    }}
                  >
                    <ExpenseCategoryIcon category={expense.category} size={20} />
                  </div>

                  <div className="expense-item-details">
                    <div className="expense-item-title-row">
                      <span className="expense-title-text">{expense.title}</span>
                      <span
                        className="cat-pill-tiny"
                        style={{
                          backgroundColor: `${catMeta.color}15`,
                          color: catMeta.color,
                        }}
                      >
                        {catMeta.name}
                      </span>
                      <span className="payment-pill-tiny">
                        {getPaymentMethodIcon(expense.paymentMethod)}
                        {getPaymentMethodLabel(expense.paymentMethod)}
                      </span>
                    </div>

                    <div className="expense-item-meta-row">
                      <span className="expense-meta-date">
                        <Calendar size={13} /> {formatKoreanDate(expense.date)}
                      </span>
                      {expense.memo && (
                        <span className="expense-meta-memo">
                          · {expense.memo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="expense-item-right">
                  <div className="expense-amount-display">
                    -{formatCurrency(expense.amount)}
                  </div>

                  <div className="expense-action-buttons">
                    <button
                      type="button"
                      className="btn-item-action edit"
                      onClick={() => onEditExpense(expense)}
                      title="지출 내역 수정"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-item-action delete"
                      onClick={() => onDeleteExpense(expense)}
                      title="지출 내역 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
