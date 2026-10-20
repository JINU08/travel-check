import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Tag, Check, AlertCircle, Plane, Home } from 'lucide-react';
import type { TripInfo, TripType } from '../types';

interface TripEditModalProps {
  isOpen: boolean;
  currentInfo: TripInfo;
  onClose: () => void;
  onSave: (newInfo: TripInfo, shouldResetItemsForType: boolean) => void;
}

export const TripEditModal: React.FC<TripEditModalProps> = ({
  isOpen,
  currentInfo,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<TripInfo>(currentInfo);
  const [resetItemsWithNewType, setResetItemsWithNewType] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(currentInfo);
      setResetItemsWithNewType(false);
      setErrorMessage(null);
    }
  }, [isOpen, currentInfo]);

  if (!isOpen) return null;

  const isTypeChanged = formData.tripType !== currentInfo.tripType;

  const handleTypeSelect = (type: TripType) => {
    setFormData((prev) => ({ ...prev, tripType: type }));
    if (type !== currentInfo.tripType) {
      setResetItemsWithNewType(true);
    } else {
      setResetItemsWithNewType(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrorMessage('여행 제목을 입력해 주세요.');
      return;
    }
    if (!formData.destination.trim()) {
      setErrorMessage('여행지를 입력해 주세요.');
      return;
    }
    if (!formData.startDate) {
      setErrorMessage('출발일을 선택해 주세요.');
      return;
    }
    if (!formData.endDate) {
      setErrorMessage('귀가일을 선택해 주세요.');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrorMessage('귀가일은 출발일 이후여야 합니다.');
      return;
    }

    onSave(
      {
        ...formData,
        title: formData.title.trim(),
        destination: formData.destination.trim(),
      },
      isTypeChanged && resetItemsWithNewType
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">여행 정보 수정</h3>
            <p className="modal-subtitle">설레는 여행 일정을 설정해 보세요</p>
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
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 여행 유형 선택 */}
          <div className="form-group">
            <label className="form-label">여행 유형</label>
            <div className="trip-type-selector">
              <button
                type="button"
                className={`type-select-btn ${formData.tripType === 'domestic' ? 'active' : ''}`}
                onClick={() => handleTypeSelect('domestic')}
              >
                <Home size={18} />
                <span className="type-btn-title">국내 여행</span>
                <span className="type-btn-sub">신분증, 국내 교통</span>
              </button>

              <button
                type="button"
                className={`type-select-btn ${formData.tripType === 'international' ? 'active' : ''}`}
                onClick={() => handleTypeSelect('international')}
              >
                <Plane size={18} />
                <span className="type-btn-title">해외 여행</span>
                <span className="type-btn-sub">여권, 항공권, 어댑터</span>
              </button>
            </div>
          </div>

          {/* 여행 유형 변경 시 기본 준비물 재설정 안내 */}
          {isTypeChanged && (
            <div className="type-change-alert">
              <label className="checkbox-label-simple">
                <input
                  type="checkbox"
                  checked={resetItemsWithNewType}
                  onChange={(e) => setResetItemsWithNewType(e.target.checked)}
                />
                <span className="checkbox-text">
                  새로운 {formData.tripType === 'international' ? '해외' : '국내'} 여행 추천 기본 준비물로 체크리스트 변경하기
                </span>
              </label>
            </div>
          )}

          {/* 여행 제목 */}
          <div className="form-group">
            <label htmlFor="trip-title-input" className="form-label">
              <Tag size={15} className="label-icon" /> 여행 제목
            </label>
            <input
              id="trip-title-input"
              type="text"
              className="form-input"
              placeholder="예: 설레는 제주 힐링 여행, 도쿄 미식 탐방"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={40}
            />
          </div>

          {/* 여행지 */}
          <div className="form-group">
            <label htmlFor="trip-dest-input" className="form-label">
              <MapPin size={15} className="label-icon" /> 여행지
            </label>
            <input
              id="trip-dest-input"
              type="text"
              className="form-input"
              placeholder="예: 제주도, 후쿠오카, 파리, 강릉"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              maxLength={30}
            />
          </div>

          {/* 출발일 & 귀가일 */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="trip-start-input" className="form-label">
                <Calendar size={15} className="label-icon" /> 출발일
              </label>
              <input
                id="trip-start-input"
                type="date"
                className="form-input date-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="trip-end-input" className="form-label">
                <Calendar size={15} className="label-icon" /> 귀가일
              </label>
              <input
                id="trip-end-input"
                type="date"
                className="form-input date-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
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
              저장 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
