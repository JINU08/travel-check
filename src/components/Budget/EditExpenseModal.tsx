import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Tag, Calendar, CreditCard, FileText } from 'lucide-react';
import type { ExpenseCategory, ExpenseItem, PaymentMethod } from '../../types';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../data/expenseCategories';
import { ExpenseCategoryIcon } from './ExpenseCategoryIcon';

interface EditExpenseModalProps {
  expense: ExpenseItem | null;
  onClose: () => void;
  onSave: (updated: ExpenseItem) => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  expense,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setTitle(expense.title);
      setAmountStr(expense.amount.toLocaleString('ko-KR'));
      setDate(expense.date);
      setPaymentMethod(expense.paymentMethod);
      setMemo(expense.memo || '');
      setErrorMessage(null);
    }
  }, [expense]);

  if (!expense) return null;

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
      setErrorMessage('지출 항목명을 입력해 주세요.');
      return;
    }

    const numericAmount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('0원보다 큰 금액을 입력해 주세요.');
      return;
    }

    if (!date) {
      setErrorMessage('지출 일자를 선택해 주세요.');
      return;
    }

    onSave({
      ...expense,
      category,
      title: trimmedTitle,
      amount: numericAmount,
      date,
      paymentMethod,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">지출 내역 수정</h3>
            <p className="modal-subtitle">기록된 여행 경비 내용을 수정합니다</p>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errorMessage && (
            <div className="form-error-banner">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={14} className="label-icon" /> 카테고리
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
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={14} className="label-icon" /> 지출 항목명
            </label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">
              금액 (원)
            </label>
            <div className="amount-input-wrap">
              <input
                type="text"
                className="form-input amount-input"
                value={amountStr}
                onChange={handleAmountChange}
              />
              <span className="currency-suffix">원</span>
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} className="label-icon" /> 지출 일자
            </label>
            <input
              type="date"
              className="form-input date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label className="form-label">
              <CreditCard size={14} className="label-icon" /> 결제 수단
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

          {/* Memo */}
          <div className="form-group">
            <label className="form-label">
              메모 (선택)
            </label>
            <input
              type="text"
              className="form-input"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="추가 메모 입력"
              maxLength={50}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
