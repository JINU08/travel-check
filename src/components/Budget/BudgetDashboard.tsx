import React, { useState } from 'react';
import {
  Wallet,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Check,
  X,
  PieChart,
} from 'lucide-react';
import type { BudgetInfo, CategoryExpenseStat } from '../../types';
import { EXPENSE_CATEGORIES } from '../../data/expenseCategories';
import { formatCurrency } from '../../utils/storage';
import { ExpenseCategoryIcon } from './ExpenseCategoryIcon';

interface BudgetDashboardProps {
  budgetInfo: BudgetInfo;
  onUpdateBudget: (newBudget: number) => void;
  categoryStats: CategoryExpenseStat[];
  totalSpent: number;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  budgetInfo,
  onUpdateBudget,
  categoryStats,
  totalSpent,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budgetInfo.totalBudget));

  const totalBudget = budgetInfo.totalBudget;
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;
  const burnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const burnRateFormatted = burnRate.toFixed(1);

  const handleStartEdit = () => {
    setBudgetInput(String(totalBudget));
    setIsEditingBudget(true);
  };

  const handleSaveBudget = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(budgetInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num >= 0) {
      onUpdateBudget(num);
    }
    setIsEditingBudget(false);
  };

  const handleCancelEdit = () => {
    setBudgetInput(String(totalBudget));
    setIsEditingBudget(false);
  };

  // Determine progress bar style based on burn rate
  const getProgressBarColor = () => {
    if (isOverBudget) return 'linear-gradient(90deg, #ef4444, #dc2626)';
    if (burnRate >= 80) return 'linear-gradient(90deg, #f59e0b, #d97706)';
    return 'linear-gradient(90deg, #0ea5e9, #0284c7)';
  };

  return (
    <section className="budget-dashboard-card" aria-label="여행 예산 요약 대시보드">
      {/* Header */}
      <div className="budget-card-header">
        <div className="budget-title-group">
          <div className="budget-icon-badge">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="budget-card-title">여행 예산 현황</h3>
            <p className="budget-card-subtitle">
              계획한 예산 내에서 현명하고 즐거운 여행을 기록하세요
            </p>
          </div>
        </div>

        {/* Budget Setting / Inline Edit */}
        <div className="budget-edit-wrapper">
          {isEditingBudget ? (
            <div className="budget-inline-form">
              <input
                type="text"
                className="budget-number-input"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="총 예산 금액 입력"
                autoFocus
              />
              <button
                type="button"
                className="btn-budget-save"
                onClick={() => handleSaveBudget()}
                title="저장"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="btn-budget-cancel"
                onClick={handleCancelEdit}
                title="취소"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-open-budget-edit"
              onClick={handleStartEdit}
              title="총 예산 수정하기"
            >
              <Edit2 size={14} />
              <span>총 예산 설정</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="budget-stats-grid">
        <div className="budget-stat-box">
          <span className="budget-stat-label">총 설정 예산</span>
          <div className="budget-stat-value primary">
            {formatCurrency(totalBudget)}
          </div>
        </div>

        <div className="budget-stat-box">
          <span className="budget-stat-label">총 지출액</span>
          <div className="budget-stat-value spent">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div className={`budget-stat-box ${isOverBudget ? 'over-budget' : ''}`}>
          <span className="budget-stat-label">
            {isOverBudget ? '예산 초과액' : '남은 예산'}
          </span>
          <div className={`budget-stat-value ${isOverBudget ? 'danger' : 'safe'}`}>
            {isOverBudget
              ? `-${formatCurrency(Math.abs(remainingBudget))}`
              : formatCurrency(remainingBudget)}
          </div>
        </div>

        <div className="budget-stat-box">
          <span className="budget-stat-label">예산 소진율</span>
          <div
            className={`budget-stat-value ${
              isOverBudget ? 'danger' : burnRate >= 80 ? 'warning' : 'rate'
            }`}
          >
            {burnRateFormatted}%
          </div>
        </div>
      </div>

      {/* Main Budget Progress Bar */}
      <div className="budget-progress-wrap">
        <div className="budget-progress-label-row">
          <span className="progress-hint">
            {isOverBudget ? (
              <span className="text-danger-flex">
                <AlertCircle size={14} /> 예산을 {formatCurrency(Math.abs(remainingBudget))} 초과 지출했습니다!
              </span>
            ) : burnRate >= 80 ? (
              <span className="text-warning-flex">
                <AlertCircle size={14} /> 예산의 80% 이상을 소진했습니다. 지출에 유의하세요.
              </span>
            ) : (
              <span className="text-safe-flex">
                <CheckCircle2 size={14} /> 안정적으로 예산을 관리하고 있습니다.
              </span>
            )}
          </span>
          <span className="progress-fraction">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
          </span>
        </div>

        <div className="budget-progress-track">
          <div
            className="budget-progress-fill"
            style={{
              width: `${Math.min(burnRate, 100)}%`,
              background: getProgressBarColor(),
            }}
          />
        </div>
      </div>

      {/* Category Breakdown Multi-bar (Stacked Bar) */}
      {totalSpent > 0 && (
        <div className="category-breakdown-section">
          <div className="breakdown-header">
            <span className="breakdown-title">
              <PieChart size={15} /> 카테고리별 지출 비율
            </span>
          </div>

          <div className="stacked-category-bar">
            {categoryStats
              .filter((stat) => stat.totalAmount > 0)
              .map((stat) => (
                <div
                  key={stat.category}
                  className="stacked-bar-segment"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color,
                  }}
                  title={`${stat.name}: ${formatCurrency(stat.totalAmount)} (${stat.percentage.toFixed(1)}%)`}
                />
              ))}
          </div>

          {/* Category breakdown pill legend */}
          <div className="breakdown-legend-list">
            {categoryStats
              .filter((stat) => stat.totalAmount > 0)
              .map((stat) => (
                <div key={stat.category} className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="legend-name">{stat.name}</span>
                  <span className="legend-amount">
                    {formatCurrency(stat.totalAmount)}
                  </span>
                  <span className="legend-pct">
                    ({stat.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6 Category Summary Cards */}
      <div className="expense-category-grid">
        {EXPENSE_CATEGORIES.map((catMeta) => {
          const stat = categoryStats.find((s) => s.category === catMeta.id);
          const amount = stat ? stat.totalAmount : 0;
          const count = stat ? stat.count : 0;
          const pct = stat ? stat.percentage : 0;

          return (
            <div key={catMeta.id} className="category-summary-box">
              <div className="cat-box-top">
                <div
                  className="cat-box-icon"
                  style={{
                    backgroundColor: `${catMeta.color}15`,
                    color: catMeta.color,
                  }}
                >
                  <ExpenseCategoryIcon category={catMeta.id} size={18} />
                </div>
                <div className="cat-box-info">
                  <span className="cat-box-name">{catMeta.name}</span>
                  <span className="cat-box-count">{count}건 기록</span>
                </div>
              </div>
              <div className="cat-box-amount">
                {formatCurrency(amount)}
              </div>
              <div className="cat-box-footer">
                <div className="cat-mini-bar-track">
                  <div
                    className="cat-mini-bar-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: catMeta.color,
                    }}
                  />
                </div>
                <span className="cat-box-pct">{pct.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
