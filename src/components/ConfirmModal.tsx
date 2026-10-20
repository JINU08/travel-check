import React, { useState } from 'react';
import { Trash2, RotateCcw, X, CheckCheck } from 'lucide-react';
import type { TripType } from '../types';

export type ConfirmActionType =
  | { type: 'delete-item'; itemId: string; itemName: string }
  | { type: 'delete-expense'; expenseId: string; expenseTitle: string }
  | { type: 'uncheck-all' }
  | { type: 'reset-checklist'; tripType: TripType };

interface ConfirmModalProps {
  action: ConfirmActionType | null;
  onClose: () => void;
  onConfirm: (payload?: any) => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  action,
  onClose,
  onConfirm,
}) => {
  const [resetOption, setResetOption] = useState<'restore-default' | 'clear-all'>('restore-default');

  if (!action) return null;

  const renderContent = () => {
    switch (action.type) {
      case 'delete-item':
        return {
          icon: <Trash2 size={24} className="modal-icon-danger" />,
          title: '준비물 삭제',
          description: (
            <span>
              '<strong>{action.itemName}</strong>' 준비물을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </span>
          ),
          confirmText: '삭제하기',
          confirmClass: 'btn-danger',
          payload: action.itemId,
        };

      case 'delete-expense':
        return {
          icon: <Trash2 size={24} className="modal-icon-danger" />,
          title: '지출 내역 삭제',
          description: (
            <span>
              '<strong>{action.expenseTitle}</strong>' 지출 내역을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </span>
          ),
          confirmText: '삭제하기',
          confirmClass: 'btn-danger',
          payload: action.expenseId,
        };

      case 'uncheck-all':
        return {
          icon: <CheckCheck size={24} className="modal-icon-warning" />,
          title: '완료 항목 전체 해제',
          description: (
            <span>
              체크 완료된 모든 준비물을 미완료 상태로 되돌리시겠습니까?
            </span>
          ),
          confirmText: '전체 해제',
          confirmClass: 'btn-warning',
          payload: undefined,
        };

      case 'reset-checklist': {
        const typeName = action.tripType === 'international' ? '해외 여행' : '국내 여행';
        return {
          icon: <RotateCcw size={24} className="modal-icon-danger" />,
          title: '체크리스트 초기화',
          description: (
            <div>
              <p style={{ marginBottom: '1rem' }}>
                체크리스트를 어떻게 초기화하시겠습니까? 원하는 방식을 선택해 주세요.
              </p>
              <div className="reset-options-list">
                <label className={`reset-option-item ${resetOption === 'restore-default' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="reset-option"
                    checked={resetOption === 'restore-default'}
                    onChange={() => setResetOption('restore-default')}
                  />
                  <div>
                    <span className="reset-option-title">{typeName} 기본 준비물로 복원</span>
                    <span className="reset-option-desc">
                      카테고리별 추천 필수 리스트로 깔끔하게 재설정합니다.
                    </span>
                  </div>
                </label>

                <label className={`reset-option-item ${resetOption === 'clear-all' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="reset-option"
                    checked={resetOption === 'clear-all'}
                    onChange={() => setResetOption('clear-all')}
                  />
                  <div>
                    <span className="reset-option-title">모든 준비물 완전히 비우기</span>
                    <span className="reset-option-desc">
                      빈 목록에서 나만의 준비물을 직접 처음부터 작성합니다.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          ),
          confirmText: '초기화 실행',
          confirmClass: 'btn-danger',
          payload: resetOption,
        };
      }
    }
  };

  const content = renderContent();

  const handleConfirm = () => {
    onConfirm(content.payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-confirm-icon-wrap">
            {content.icon}
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

        <div className="modal-confirm-body">
          <h3 className="modal-confirm-title">{content.title}</h3>
          <div className="modal-confirm-desc">{content.description}</div>
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
            type="button"
            className={`btn ${content.confirmClass}`}
            onClick={handleConfirm}
          >
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
