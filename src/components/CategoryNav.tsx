import React from 'react';
import { CATEGORIES } from '../data/defaultItems';
import type { CategoryId, ChecklistItem } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryNavProps {
  selectedCategory: 'all' | CategoryId;
  onSelectCategory: (categoryId: 'all' | CategoryId) => void;
  items: ChecklistItem[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  // Compute counts for all and each category
  const getCategoryCount = (catId?: CategoryId) => {
    if (!catId) {
      const total = items.length;
      const completed = items.filter((item) => item.completed).length;
      return { total, completed };
    }
    const catItems = items.filter((item) => item.categoryId === catId);
    const total = catItems.length;
    const completed = catItems.filter((item) => item.completed).length;
    return { total, completed };
  };

  const allCounts = getCategoryCount();

  return (
    <nav className="category-nav-wrapper" aria-label="준비물 카테고리 선택">
      <div className="category-pills-list">
        {/* '전체' 탭 */}
        <button
          type="button"
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <CategoryIcon categoryId="all" size={17} className="pill-icon" />
          <span className="pill-name">전체</span>
          <span className="pill-count">
            {allCounts.completed}/{allCounts.total}
          </span>
        </button>

        {/* 각 카테고리 탭 */}
        {CATEGORIES.map((cat) => {
          const { total, completed } = getCategoryCount(cat.id);
          const isSelected = selectedCategory === cat.id;
          const isDone = total > 0 && completed === total;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${isSelected ? 'active' : ''} ${isDone ? 'category-all-done' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <CategoryIcon categoryId={cat.id} size={17} className="pill-icon" />
              <span className="pill-name">{cat.name}</span>
              <span className="pill-count">
                {completed}/{total}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
