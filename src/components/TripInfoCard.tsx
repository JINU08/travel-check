import React from 'react';
import {
  MapPin,
  Calendar,
  Plane,
  Home,
  Edit3,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import type { TripInfo } from '../types';
import { calculateDDay, calculateTripDuration, formatKoreanDate } from '../utils/date';

interface TripInfoCardProps {
  tripInfo: TripInfo;
  onEditClick: () => void;
}

export const TripInfoCard: React.FC<TripInfoCardProps> = ({
  tripInfo,
  onEditClick,
}) => {
  const duration = calculateTripDuration(tripInfo.startDate, tripInfo.endDate);
  const dday = calculateDDay(tripInfo.startDate);
  const isDomestic = tripInfo.tripType === 'domestic';
  const isLongTrip = duration.days >= 5;

  return (
    <section className="trip-info-card" aria-label="여행 기본 정보">
      <div className="trip-card-header">
        <div className="trip-badge-group">
          <span className={`trip-type-badge ${isDomestic ? 'domestic' : 'international'}`}>
            {isDomestic ? (
              <>
                <Home size={14} className="badge-icon" /> 국내 여행
              </>
            ) : (
              <>
                <Plane size={14} className="badge-icon" /> 해외 여행
              </>
            )}
          </span>

          {dday.label && (
            <span
              className={`trip-dday-badge ${
                dday.isToday ? 'today' : dday.isPast ? 'past' : 'upcoming'
              }`}
            >
              <Clock size={13} className="badge-icon" />
              {dday.label}
            </span>
          )}

          <span className="trip-duration-badge">
            {duration.label}
          </span>
        </div>

        <button
          type="button"
          className="btn-edit-trip"
          onClick={onEditClick}
          aria-label="여행 정보 수정"
        >
          <Edit3 size={15} />
          <span>정보 수정</span>
        </button>
      </div>

      <div className="trip-card-body">
        <h2 className="trip-title">{tripInfo.title || '나의 설레는 여행'}</h2>

        <div className="trip-meta-grid">
          <div className="meta-item">
            <div className="meta-icon-wrapper destination">
              <MapPin size={18} />
            </div>
            <div className="meta-content">
              <span className="meta-label">여행지</span>
              <span className="meta-value">{tripInfo.destination || '미정'}</span>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon-wrapper calendar">
              <Calendar size={18} />
            </div>
            <div className="meta-content">
              <span className="meta-label">여행 기간</span>
              <span className="meta-value">
                {formatKoreanDate(tripInfo.startDate)} ~ {formatKoreanDate(tripInfo.endDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 스마트 여행 가이드 배너 */}
      <div className="trip-card-footer">
        {isLongTrip ? (
          <div className="smart-trip-tip tip-long">
            <Sparkles size={16} className="tip-icon" />
            <span>
              <strong>{duration.days}일간의 긴 여정:</strong> 여분의 의류, 세탁용품 및 상비약을 넉넉하게 챙겨보세요!
            </span>
          </div>
        ) : !isDomestic ? (
          <div className="smart-trip-tip tip-overseas">
            <Info size={16} className="tip-icon" />
            <span>
              <strong>해외여행 필수 체크:</strong> 여권 만료일(6개월 이상), 여행자 보험, 현지 멀티 어댑터를 꼭 확인하세요.
            </span>
          </div>
        ) : (
          <div className="smart-trip-tip tip-domestic">
            <Sparkles size={16} className="tip-icon" />
            <span>
              <strong>국내 힐링 여행:</strong> 가벼운 발걸음으로 신분증과 필수 예약 정보를 챙겨 떠나보세요!
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
