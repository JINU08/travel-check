import React from 'react';
import {
  CheckCheck,
  RotateCcw,
  Search,
  X,
  ListFilter,
  CheckCircle,
  Circle,
} from 'lucide-react';
import type { StatusFilter } from '../types';

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completedCount: number;
  totalCount: number;
  onUncheckAll: () => void;
  onResetChecklist: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  completedCount,
  totalCount,
  onUncheckAll,
  onResetChecklist,
}) => {
  return (
    <div className="filter-bar-container">
      {/* Upper row: Search box & Status filter tabs */}
      <div className="filter-controls-row">
        {/* Status Filter Buttons */}
        <div className="status-filter-group" role="tablist" aria-label="상태 필터">
          <button
            type="button"
            className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('all')}
          >
            <ListFilter size={15} />
            <span>전체 보기</span>
            <span className="badge-pill-micro">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`status-btn ${statusFilter === 'uncompleted' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('uncompleted')}
          >
            <Circle size={14} />
            <span>미완료만</span>
            <span className="badge-pill-micro">{totalCount - completedCount}</span>
          </button>

          <button
            type="button"
            className={`status-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('completed')}
          >
            <CheckCircle size={14} />
            <span>완료만</span>
            <span className="badge-pill-micro">{completedCount}</span>
          </button>
        </div>

        {/* Real-time Search Box */}
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="준비물 검색 (예: 여권, 충전기)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange('')}
              aria-label="검색어 지우기"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Action buttons row */}
      <div className="action-buttons-row">
        <div className="action-buttons-left">
          {searchQuery && (
            <span className="search-result-hint">
              '<strong>{searchQuery}</strong>' 검색 결과
            </span>
          )}
        </div>

        <div className="action-buttons-right">
          <button
            type="button"
            className="btn-action-ghost"
            onClick={onUncheckAll}
            disabled={completedCount === 0}
            title="모든 완료 체크를 해제합니다"
          >
            <CheckCheck size={15} />
            <span>완료 항목 전체 해제</span>
          </button>

          <button
            type="button"
            className="btn-action-ghost danger"
            onClick={onResetChecklist}
            title="체크리스트를 초기 상태로 되돌립니다"
          >
            <RotateCcw size={15} />
            <span>체크리스트 초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
};
