import React, { useState, useRef } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/defaultItems';
import { CategoryIcon } from './CategoryIcon';

interface AddItemFormProps {
  currentCategory: 'all' | CategoryId;
  onAddItem: (name: string, categoryId: CategoryId) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  currentCategory,
  onAddItem,
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryId>(
    currentCategory === 'all' ? 'essential' : currentCategory
  );
  const [itemName, setItemName] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync category if currentCategory changes and isn't 'all'
  React.useEffect(() => {
    if (currentCategory !== 'all') {
      setSelectedCat(currentCategory);
    }
  }, [currentCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = itemName.trim();
    if (!trimmed) {
      setErrorText('준비물 이름을 입력해 주세요.');
      inputRef.current?.focus();
      return;
    }

    onAddItem(trimmed, selectedCat);
    setItemName('');
    setErrorText(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
    if (errorText) setErrorText(null);
  };

  return (
    <div className="add-item-card">
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="add-form-row">
          {/* Category Select Dropdown */}
          <div className="category-select-wrapper">
            <CategoryIcon categoryId={selectedCat} size={18} className="select-icon" />
            <select
              className="category-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as CategoryId)}
              aria-label="카테고리 선택"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Item Name Input */}
          <div className="item-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className={`item-text-input ${errorText ? 'has-error' : ''}`}
              placeholder="새로운 준비물 입력 (예: 목베개, 삼각대, 비타민)..."
              value={itemName}
              onChange={handleInputChange}
              maxLength={40}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-add-item"
            title="준비물 추가 (Enter)"
          >
            <Plus size={18} />
            <span className="btn-add-text">추가</span>
          </button>
        </div>

        {errorText && (
          <div className="add-item-error">
            <AlertCircle size={14} />
            <span>{errorText}</span>
          </div>
        )}
      </form>
    </div>
  );
};
