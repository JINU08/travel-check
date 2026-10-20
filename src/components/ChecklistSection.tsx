import React from 'react';
import { CATEGORIES } from '../data/defaultItems';
import type { CategoryId, ChecklistItem, StatusFilter } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { ChecklistItemRow } from './ChecklistItemRow';
import { CheckCircle2, Inbox } from 'lucide-react';

interface ChecklistSectionProps {
  items: ChecklistItem[];
  selectedCategory: 'all' | CategoryId;
  statusFilter: StatusFilter;
  searchQuery: string;
  onToggleItem: (id: string) => void;
  onEditItem: (id: string, newName: string) => void;
  onDeleteItem: (item: ChecklistItem) => void;
  onResetFilters: () => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  selectedCategory,
  statusFilter,
  searchQuery,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onResetFilters,
}) => {
  // Filter logic
  const filteredItems = items.filter((item) => {
    // 1. Category filter
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    // 2. Status filter
    if (statusFilter === 'completed' && !item.completed) {
      return false;
    }
    if (statusFilter === 'uncompleted' && item.completed) {
      return false;
    }
    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return item.name.toLowerCase().includes(q);
    }
    return true;
  });

  // If nothing matches filters
  if (filteredItems.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <Inbox size={42} className="empty-icon" />
        </div>
        <h4 className="empty-title">조건에 맞는 준비물이 없습니다</h4>
        <p className="empty-description">
          {searchQuery
            ? `'${searchQuery}' 검색 결과가 없습니다.`
            : statusFilter === 'completed'
            ? '아직 완료된 준비물이 없습니다. 체크박스를 눌러 준비를 완료해보세요!'
            : statusFilter === 'uncompleted'
            ? '모든 준비물을 완료했습니다! 🎉'
            : '해당 카테고리에 등록된 준비물이 없습니다.'}
        </p>
        <button
          type="button"
          className="btn-reset-filter"
          onClick={onResetFilters}
        >
          필터 및 검색 초기화
        </button>
      </div>
    );
  }

  // Determine which categories to render
  const categoriesToRender =
    selectedCategory === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === selectedCategory);

  return (
    <div className="checklist-sections-container">
      {categoriesToRender.map((category) => {
        // Items in this category matching current status & search filter
        const categoryItems = filteredItems.filter(
          (item) => item.categoryId === category.id
        );

        // Overall stats for this category (unfiltered by status/search for context)
        const allCategoryItems = items.filter(
          (item) => item.categoryId === category.id
        );
        const totalCat = allCategoryItems.length;
        const completedCat = allCategoryItems.filter((i) => i.completed).length;
        const isCatFullyDone = totalCat > 0 && totalCat === completedCat;
        const catPercentage = totalCat > 0 ? Math.round((completedCat / totalCat) * 100) : 0;

        // Skip category card if it has no items matching the active search/status
        if (categoryItems.length === 0) return null;

        return (
          <section
            key={category.id}
            className={`category-checklist-card ${isCatFullyDone ? 'is-fully-done' : ''}`}
            aria-label={`${category.name} 체크리스트`}
          >
            {/* Category Card Header */}
            <div className="category-card-header">
              <div className="category-header-left">
                <div
                  className="category-icon-box"
                  style={{ backgroundColor: `${category.color}18`, color: category.color }}
                >
                  <CategoryIcon categoryId={category.id} size={20} />
                </div>
                <div>
                  <div className="cat-title-row">
                    <h3 className="category-title">{category.name}</h3>
                    {isCatFullyDone && (
                      <span className="badge-cat-complete">
                        <CheckCircle2 size={13} /> 완료!
                      </span>
                    )}
                  </div>
                  <p className="category-description">{category.description}</p>
                </div>
              </div>

              <div className="category-header-right">
                <div className="cat-counter-group">
                  <span className="cat-counter-label">완료</span>
                  <span className="cat-counter-highlight">
                    {completedCat}
                  </span>
                  <span className="cat-counter-total">/ {totalCat}</span>
                  <span className="cat-counter-percent">({catPercentage}%)</span>
                </div>
              </div>
            </div>

            {/* Category mini progress bar */}
            <div className="cat-mini-progress-track">
              <div
                className="cat-mini-progress-fill"
                style={{
                  width: `${catPercentage}%`,
                  backgroundColor: isCatFullyDone ? '#10b981' : category.color,
                }}
              />
            </div>

            {/* Item list */}
            <div className="checklist-items-list">
              {categoryItems.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggleItem}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
