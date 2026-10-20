/**
 * 날짜 관련 유틸리티 함수 모음
 */

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFutureDateString = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatKoreanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  } catch {
    return dateStr;
  }
};

export const calculateTripDuration = (startDateStr: string, endDateStr: string): {
  nights: number;
  days: number;
  label: string;
} => {
  if (!startDateStr || !endDateStr) {
    return { nights: 0, days: 0, label: '일정 미정' };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  // Normalize time
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { nights: 0, days: 0, label: '날짜 설정 오류' };
  }
  if (diffDays === 0) {
    return { nights: 0, days: 1, label: '당일치기 여행' };
  }

  const nights = diffDays;
  const days = diffDays + 1;
  return {
    nights,
    days,
    label: `${nights}박 ${days}일`,
  };
};

export const calculateDDay = (targetDateStr: string): {
  diffDays: number;
  label: string;
  isPast: boolean;
  isToday: boolean;
} => {
  if (!targetDateStr) {
    return { diffDays: 0, label: '', isPast: false, isToday: false };
  }

  const target = new Date(targetDateStr);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { diffDays: 0, label: 'D-DAY', isPast: false, isToday: true };
  } else if (diffDays > 0) {
    return { diffDays, label: `D-${diffDays}`, isPast: false, isToday: false };
  } else {
    return { diffDays, label: `D+${Math.abs(diffDays)}`, isPast: true, isToday: false };
  }
};
