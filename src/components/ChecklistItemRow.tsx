import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';
import type { ChecklistItem } from '../types';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDelete: (item: ChecklistItem) => void;
}

export const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(item.name);
    setIsEditing(true);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.name) {
      onEdit(item.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditValue(item.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={`checklist-item-row ${item.completed ? 'completed' : ''} ${
        isEditing ? 'is-editing' : ''
      }`}
    >
      {/* Checkbox Button */}
      <button
        type="button"
        className={`custom-checkbox-btn ${item.completed ? 'checked' : ''}`}
        onClick={() => onToggle(item.id)}
        aria-label={item.completed ? `${item.name} 완료 취소` : `${item.name} 완료 표시`}
      >
        {item.completed ? (
          <CheckSquare size={20} className="checkbox-icon checked" />
        ) : (
          <Square size={20} className="checkbox-icon" />
        )}
      </button>

      {/* Item Content (Text or Edit Input) */}
      <div className="item-text-area" onClick={() => !isEditing && onToggle(item.id)}>
        {isEditing ? (
          <div className="inline-edit-wrapper" onClick={(e) => e.stopPropagation()}>
            <input
              ref={editInputRef}
              type="text"
              className="inline-edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={40}
            />
            <div className="inline-edit-actions">
              <button
                type="button"
                className="btn-inline-save"
                onClick={() => handleSaveEdit()}
                title="수정 완료 (Enter)"
              >
                <Check size={15} />
              </button>
              <button
                type="button"
                className="btn-inline-cancel"
                onClick={handleCancelEdit}
                title="취소 (Esc)"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="item-name-group">
            <span className={`item-name-text ${item.completed ? 'text-strikethrough' : ''}`}>
              {item.name}
            </span>
            {item.isCustom && (
              <span className="badge-custom-item" title="직접 추가한 준비물">
                직접 추가
              </span>
            )}
          </div>
        )}
      </div>

      {/* Row Action Buttons (Edit & Delete) */}
      {!isEditing && (
        <div className="item-row-actions">
          <button
            type="button"
            className="btn-item-action edit"
            onClick={handleStartEdit}
            aria-label={`${item.name} 이름 수정`}
            title="이름 수정"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="btn-item-action delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            aria-label={`${item.name} 삭제`}
            title="삭제"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
