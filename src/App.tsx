import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TripInfoCard } from './components/TripInfoCard';
import { TripEditModal } from './components/TripEditModal';
import { ProgressBar } from './components/ProgressBar';
import { CategoryNav } from './components/CategoryNav';
import { FilterBar } from './components/FilterBar';
import { AddItemForm } from './components/AddItemForm';
import { ChecklistSection } from './components/ChecklistSection';
import { ConfirmModal } from './components/ConfirmModal';
import { BudgetDashboard } from './components/Budget/BudgetDashboard';
import { AddExpenseForm } from './components/Budget/AddExpenseForm';
import { ExpenseList } from './components/Budget/ExpenseList';
import { EditExpenseModal } from './components/Budget/EditExpenseModal';
import type { ConfirmActionType } from './components/ConfirmModal';
import type {
  BudgetInfo,
  CategoryId,
  ChecklistItem,
  ChecklistStats,
  ExpenseCategory,
  ExpenseItem,
  MainTab,
  PaymentMethod,
  StatusFilter,
  TripInfo,
} from './types';
import {
  loadBudgetInfo,
  loadChecklistItems,
  loadExpenses,
  loadFilterState,
  loadTripInfo,
  saveBudgetInfo,
  saveChecklistItems,
  saveExpenses,
  saveFilterState,
  saveTripInfo,
  formatCurrency,
} from './utils/storage';
import { generateDefaultItems } from './data/defaultItems';
import { EXPENSE_CATEGORIES } from './data/expenseCategories';
import { CheckCircle2, Info, ListChecks, Wallet } from 'lucide-react';
import './index.css';
import './App.css';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export const App: React.FC = () => {
  // 1. Main Navigation Tab ('checklist' | 'budget')
  const [activeTab, setActiveTab] = useState<MainTab>('checklist');

  // 2. Storage-synced states (Trip, Checklist, Budget, Expenses)
  const [tripInfo, setTripInfo] = useState<TripInfo>(() => loadTripInfo());
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    loadChecklistItems(loadTripInfo().tripType)
  );
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo>(() => loadBudgetInfo());
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => loadExpenses());

  const initialFilters = useMemo(() => loadFilterState(), []);
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryId>(
    initialFilters.category
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    initialFilters.status
  );

  // 3. Local interactive states
  const [searchQuery, setSearchQuery] = useState('');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [confirmModalAction, setConfirmModalAction] =
    useState<ConfirmActionType | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Show temporary toast message
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Sync states to LocalStorage
  useEffect(() => {
    saveTripInfo(tripInfo);
  }, [tripInfo]);

  useEffect(() => {
    saveChecklistItems(items);
  }, [items]);

  useEffect(() => {
    saveFilterState(selectedCategory, statusFilter);
  }, [selectedCategory, statusFilter]);

  useEffect(() => {
    saveBudgetInfo(budgetInfo);
  }, [budgetInfo]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // Calculate overall checklist statistics
  const stats: ChecklistStats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.completed).length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percentage };
  }, [items]);

  // Calculate budget statistics
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const categoryExpenseStats = useMemo(() => {
    return EXPENSE_CATEGORIES.map((catMeta) => {
      const catExpenses = expenses.filter((e) => e.category === catMeta.id);
      const totalAmount = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      const count = catExpenses.length;
      const percentage = totalSpent > 0 ? (totalAmount / totalSpent) * 100 : 0;
      return {
        category: catMeta.id,
        name: catMeta.name,
        color: catMeta.color,
        totalAmount,
        percentage,
        count,
      };
    });
  }, [expenses, totalSpent]);

  // Handlers for checklist items
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const handleAddItem = (name: string, categoryId: CategoryId) => {
    const newItem: ChecklistItem = {
      id: `custom-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      name,
      completed: false,
      isCustom: true,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(`'${name}' 준비물이 추가되었습니다!`);
  };

  const handleEditItem = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
    showToast('준비물 이름이 수정되었습니다.');
  };

  const handleDeleteItemClick = (item: ChecklistItem) => {
    setConfirmModalAction({
      type: 'delete-item',
      itemId: item.id,
      itemName: item.name,
    });
  };

  const handleUncheckAllClick = () => {
    if (stats.completed === 0) return;
    setConfirmModalAction({ type: 'uncheck-all' });
  };

  const handleResetChecklistClick = () => {
    setConfirmModalAction({
      type: 'reset-checklist',
      tripType: tripInfo.tripType,
    });
  };

  // Handlers for Budget & Expenses
  const handleUpdateBudget = (newBudget: number) => {
    setBudgetInfo({ totalBudget: newBudget });
    showToast(`총 여행 예산이 ${formatCurrency(newBudget)}으로 설정되었습니다.`);
  };

  const handleAddExpense = (data: {
    category: ExpenseCategory;
    title: string;
    amount: number;
    date: string;
    paymentMethod: PaymentMethod;
    memo?: string;
  }) => {
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`'${data.title}' 지출(${formatCurrency(data.amount)})이 기록되었습니다!`);
  };

  const handleEditExpenseSave = (updated: ExpenseItem) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    setEditingExpense(null);
    showToast('지출 내역이 성공적으로 수정되었습니다.');
  };

  const handleDeleteExpenseClick = (expense: ExpenseItem) => {
    setConfirmModalAction({
      type: 'delete-expense',
      expenseId: expense.id,
      expenseTitle: expense.title,
    });
  };

  // Confirm modal execution handler
  const handleConfirmAction = (payload?: any) => {
    if (!confirmModalAction) return;

    if (confirmModalAction.type === 'delete-item') {
      const itemId = payload || confirmModalAction.itemId;
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      showToast('준비물이 삭제되었습니다.', 'info');
    } else if (confirmModalAction.type === 'delete-expense') {
      const expenseId = payload || confirmModalAction.expenseId;
      setExpenses((prev) => prev.filter((item) => item.id !== expenseId));
      showToast('지출 내역이 삭제되었습니다.', 'info');
    } else if (confirmModalAction.type === 'uncheck-all') {
      setItems((prev) => prev.map((item) => ({ ...item, completed: false })));
      showToast('완료된 준비물 체크가 모두 해제되었습니다.', 'info');
    } else if (confirmModalAction.type === 'reset-checklist') {
      const resetChoice = payload as 'restore-default' | 'clear-all';
      if (resetChoice === 'clear-all') {
        setItems([]);
        showToast('모든 준비물이 비워졌습니다.', 'warning');
      } else {
        const freshDefaults = generateDefaultItems(tripInfo.tripType);
        setItems(freshDefaults);
        showToast(
          `${tripInfo.tripType === 'international' ? '해외' : '국내'} 여행 기본 준비물로 복원되었습니다.`
        );
      }
    }

    setConfirmModalAction(null);
  };

  // Trip Info save handler
  const handleSaveTripInfo = (
    newInfo: TripInfo,
    shouldResetItemsForType: boolean
  ) => {
    setTripInfo(newInfo);
    if (shouldResetItemsForType) {
      const freshDefaults = generateDefaultItems(newInfo.tripType);
      setItems(freshDefaults);
      showToast(
        `여행 정보가 저장되고 ${newInfo.tripType === 'international' ? '해외' : '국내'} 맞춤 준비물로 갱신되었습니다.`
      );
    } else {
      showToast('여행 정보가 성공적으로 저장되었습니다.');
    }
    setIsTripModalOpen(false);
  };

  // Reset filters & search in checklist
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="travel-check-app">
      {/* Toast notifications */}
      <aside className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <Info size={16} />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </aside>

      {/* Main Header */}
      <Header />

      <main className="main-content-layout">
        {/* Top Common Trip Info Card */}
        <TripInfoCard
          tripInfo={tripInfo}
          onEditClick={() => setIsTripModalOpen(true)}
        />

        {/* Main Navigation Tabs: Checklist vs Budget */}
        <div className="main-tab-switcher" role="tablist" aria-label="메인 기능 선택">
          <button
            type="button"
            className={`main-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
            role="tab"
            aria-selected={activeTab === 'checklist'}
          >
            <ListChecks size={18} />
            <span className="tab-label">준비물 체크리스트</span>
            <span className="tab-pill-badge">{stats.completed}/{stats.total} 완료 ({stats.percentage}%)</span>
          </button>

          <button
            type="button"
            className={`main-tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
            role="tab"
            aria-selected={activeTab === 'budget'}
          >
            <Wallet size={18} />
            <span className="tab-label">여행 예산 관리</span>
            <span className="tab-pill-badge budget">
              지출 {formatCurrency(totalSpent)}
            </span>
          </button>
        </div>

        {/* TAB 1: CHECKLIST VIEW */}
        {activeTab === 'checklist' && (
          <div className="tab-content-area">
            {/* Progress Section */}
            <ProgressBar stats={stats} />

            {/* Add New Item Input */}
            <section className="add-item-section">
              <AddItemForm
                currentCategory={selectedCategory}
                onAddItem={handleAddItem}
              />
            </section>

            {/* Category Pills Navigation */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              items={items}
            />

            {/* Filter & Controls Bar */}
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              completedCount={stats.completed}
              totalCount={stats.total}
              onUncheckAll={handleUncheckAllClick}
              onResetChecklist={handleResetChecklistClick}
            />

            {/* Checklist Section */}
            <ChecklistSection
              items={items}
              selectedCategory={selectedCategory}
              statusFilter={statusFilter}
              searchQuery={searchQuery}
              onToggleItem={handleToggleItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItemClick}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* TAB 2: BUDGET VIEW */}
        {activeTab === 'budget' && (
          <div className="tab-content-area">
            {/* Budget Dashboard */}
            <BudgetDashboard
              budgetInfo={budgetInfo}
              onUpdateBudget={handleUpdateBudget}
              categoryStats={categoryExpenseStats}
              totalSpent={totalSpent}
            />

            {/* Add Expense Form */}
            <AddExpenseForm onAddExpense={handleAddExpense} />

            {/* Expense Records List */}
            <ExpenseList
              expenses={expenses}
              onEditExpense={(expense) => setEditingExpense(expense)}
              onDeleteExpense={handleDeleteExpenseClick}
            />
          </div>
        )}
      </main>

      {/* Trip Edit Modal */}
      <TripEditModal
        isOpen={isTripModalOpen}
        currentInfo={tripInfo}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTripInfo}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={handleEditExpenseSave}
      />

      {/* Confirmation Modal (Item, Expense, Reset, Uncheck) */}
      <ConfirmModal
        action={confirmModalAction}
        onClose={() => setConfirmModalAction(null)}
        onConfirm={handleConfirmAction}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-copyright">
          © TRAVEL CHECK · 체크 하나로 완성하는 나만의 감성 여행 플래너 & 예산 관리
        </p>
        <p className="footer-subtext">
          브라우저 저장소를 통해 여행 준비물과 예산 지출 내역이 자동으로 안전하게 보관됩니다.
        </p>
      </footer>
    </div>
  );
};

export default App;
