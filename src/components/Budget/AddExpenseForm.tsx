import React, { useState } from 'react';
import { Plus, AlertCircle, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import type { ExpenseCategory, PaymentMethod } from '../../types';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../data/expenseCategories';
import { getTodayDateString } from '../../utils/date';
import { ExpenseCategoryIcon } from './ExpenseCategoryIcon';

interface AddExpenseFormProps {
  onAddExpense: (data: {
    category: ExpenseCategory;
    title: string;
    amount: number;
    date: string;
    paymentMethod: PaymentMethod;
    memo?: string;
  }) => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense }) => {
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick amount additions
  const handleAddAmount = (addValue: number) => {
    const current = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
    const next = current + addValue;
    setAmountStr(next.toLocaleString('ko-KR'));
    if (errorMessage) setErrorMessage(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setAmountStr('');
      return;
    }
    const num = parseInt(raw, 10);
    setAmountStr(num.toLocaleString('ko-KR'));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('지출 항목명을 입력해 주세요 (예: 저녁 식사, 택시비)');
      return;
    }

    const numericAmount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('0원보다 큰 지출 금액을 입력해 주세요.');
      return;
    }

    if (!date) {
      setErrorMessage('지출 날짜를 선택해 주세요.');
      return;
    }

    onAddExpense({
      category,
      title: trimmedTitle,
      amount: numericAmount,
      date,
      paymentMethod,
      memo: memo.trim() || undefined,
    });

    // Reset inputs
    setTitle('');
    setAmountStr('');
    setMemo('');
    setErrorMessage(null);
  };

  return (
    <div className="add-expense-card">
      <div className="add-expense-header">
        <h4 className="add-expense-title">
          <Plus size={18} /> 새 지출 기록 추가
        </h4>
        <p className="add-expense-subtitle">
          여행 중 발생한 교통비, 숙박비, 식비 등의 지출을 간편하게 기록하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="add-expense-form">
        {errorMessage && (
          <div className="form-error-banner">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="expense-inputs-grid">
          {/* 1. Category selector */}
          <div className="form-field-group">
            <label className="field-label">
              <Tag size={14} /> 카테고리
            </label>
            <div className="category-select-wrapper">
              <ExpenseCategoryIcon category={category} size={18} className="select-icon" />
              <select
                className="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.description.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Expense Title */}
          <div className="form-field-group">
            <label className="field-label">
              <FileText size={14} /> 지출 항목명
            </label>
            <input
              type="text"
              className="field-input"
              placeholder="예: 갈치조림 점심, 공항 리무진 버스"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              maxLength={40}
            />
          </div>

          {/* 3. Amount with Quick Buttons */}
          <div className="form-field-group amount-group">
            <label className="field-label">
              지출 금액 (원)
            </label>
            <div className="amount-input-wrap">
              <input
                type="text"
                className="field-input amount-input"
                placeholder="0"
                value={amountStr}
                onChange={handleAmountChange}
              />
              <span className="currency-suffix">원</span>
            </div>

            {/* Quick addition buttons */}
            <div className="quick-amount-buttons">
              <button
                type="button"
                className="btn-quick-chip"
                onClick={() => handleAddAmount(10000)}
              >
                +1만
              </button>
              <button
                type="button"
                className="btn-quick-chip"
                onClick={() => handleAddAmount(50000)}
              >
                +5만
              </button>
              <button
                type="button"
                className="btn-quick-chip"
                onClick={() => handleAddAmount(100000)}
              >
                +10만
              </button>
              <button
                type="button"
                className="btn-quick-chip clear"
                onClick={() => setAmountStr('')}
              >
                초기화
              </button>
            </div>
          </div>

          {/* 4. Date */}
          <div className="form-field-group">
            <label className="field-label">
              <Calendar size={14} /> 지출 일자
            </label>
            <input
              type="date"
              className="field-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 5. Payment Method & Memo */}
          <div className="form-field-group payment-method-field">
            <label className="field-label">
              <CreditCard size={14} /> 결제 수단
            </label>
            <div className="payment-method-pills">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`btn-method-pill ${paymentMethod === method.id ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Memo (Optional) */}
          <div className="form-field-group memo-field">
            <label className="field-label">
              메모 (선택)
            </label>
            <input
              type="text"
              className="field-input"
              placeholder="예: N분의 1 정산 예정, 영수증 챙김"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={50}
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="add-expense-actions">
          <button type="submit" className="btn btn-primary btn-add-expense">
            <Plus size={16} />
            지출 내역 등록
          </button>
        </div>
      </form>
    </div>
  );
};
