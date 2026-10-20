import type { Category, ChecklistItem, TripType } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'essential',
    name: '여행 필수품',
    icon: 'ShieldCheck',
    color: '#0284c7',
    description: '신분증, 결제수단 및 필수 예약 서류',
  },
  {
    id: 'clothing',
    name: '의류',
    icon: 'Shirt',
    color: '#0ea5e9',
    description: '날씨와 일정에 맞춘 편안한 옷과 겉옷',
  },
  {
    id: 'toiletries',
    name: '세면도구',
    icon: 'Droplets',
    color: '#06b6d4',
    description: '청결과 피부 관리를 위한 데일리 케어 용품',
  },
  {
    id: 'electronics',
    name: '전자기기',
    icon: 'Smartphone',
    color: '#3b82f6',
    description: '여행의 순간을 기록하고 배터리를 책임질 기기',
  },
  {
    id: 'health',
    name: '건강 및 위생',
    icon: 'HeartPulse',
    color: '#10b981',
    description: '안전하고 건강한 여행을 위한 상비용품',
  },
  {
    id: 'etc',
    name: '기타',
    icon: 'Package',
    color: '#6366f1',
    description: '날씨 대비용품 및 여행 편의 소품',
  },
];

// 국내 여행 기본 준비물
export const DOMESTIC_DEFAULT_ITEMS: Omit<ChecklistItem, 'id' | 'createdAt'>[] = [
  // 여행 필수품
  { categoryId: 'essential', name: '신분증 (주민등록증 / 운전면허증)', completed: false },
  { categoryId: 'essential', name: '교통 예약 정보 (KTX / 고속버스 / 항공권)', completed: false },
  { categoryId: 'essential', name: '숙소 예약 확인서', completed: false },
  { categoryId: 'essential', name: '지갑 (신용카드, 현금, 신분증)', completed: false },

  // 의류
  { categoryId: 'clothing', name: '상의 (일정별 맞춤)', completed: false },
  { categoryId: 'clothing', name: '하의 (바지 / 스커트)', completed: false },
  { categoryId: 'clothing', name: '속옷', completed: false },
  { categoryId: 'clothing', name: '양말', completed: false },
  { categoryId: 'clothing', name: '편안한 잠옷', completed: false },
  { categoryId: 'clothing', name: '외투 / 겉옷 (일교차 대비)', completed: false },

  // 세면도구
  { categoryId: 'toiletries', name: '칫솔 및 치약', completed: false },
  { categoryId: 'toiletries', name: '샴푸 & 린스', completed: false },
  { categoryId: 'toiletries', name: '바디워시', completed: false },
  { categoryId: 'toiletries', name: '수건', completed: false },
  { categoryId: 'toiletries', name: '스킨케어 제품 (로션, 선크림)', completed: false },

  // 전자기기
  { categoryId: 'electronics', name: '스마트폰', completed: false },
  { categoryId: 'electronics', name: '충전기 및 케이블', completed: false },
  { categoryId: 'electronics', name: '보조배터리', completed: false },
  { categoryId: 'electronics', name: '이어폰 / 헤드폰', completed: false },
  { categoryId: 'electronics', name: '카메라 (선택)', completed: false },

  // 건강 및 위생
  { categoryId: 'health', name: '개인 상비약 (소화제, 두통약, 밴드)', completed: false },
  { categoryId: 'health', name: '마스크', completed: false },
  { categoryId: 'health', name: '물티슈', completed: false },
  { categoryId: 'health', name: '손 소독제', completed: false },

  // 기타
  { categoryId: 'etc', name: '우산 / 양산', completed: false },
  { categoryId: 'etc', name: '선글라스', completed: false },
  { categoryId: 'etc', name: '여행용 보조 가방 / 에코백', completed: false },
  { categoryId: 'etc', name: '이동 중 먹을 간식', completed: false },
];

// 해외 여행 기본 준비물
export const INTERNATIONAL_DEFAULT_ITEMS: Omit<ChecklistItem, 'id' | 'createdAt'>[] = [
  // 여행 필수품
  { categoryId: 'essential', name: '여권 (유효기간 6개월 이상 확인)', completed: false },
  { categoryId: 'essential', name: '신분증 및 여권 사본', completed: false },
  { categoryId: 'essential', name: '항공권 (E-티켓 출력본/모바일)', completed: false },
  { categoryId: 'essential', name: '숙소 예약 확인서 (바우처)', completed: false },
  { categoryId: 'essential', name: '여행자 보험 가입 증명서', completed: false },
  { categoryId: 'essential', name: '지갑 (외화 현금, 트래블카드, 비상 카드)', completed: false },

  // 의류
  { categoryId: 'clothing', name: '상의 (날씨별 세팅)', completed: false },
  { categoryId: 'clothing', name: '하의', completed: false },
  { categoryId: 'clothing', name: '속옷 (일정 + 1~2벌 여유)', completed: false },
  { categoryId: 'clothing', name: '양말', completed: false },
  { categoryId: 'clothing', name: '편안한 잠옷', completed: false },
  { categoryId: 'clothing', name: '기내용 & 현지 외투', completed: false },

  // 세면도구
  { categoryId: 'toiletries', name: '칫솔 & 치약 (기내용 100ml 규격 고려)', completed: false },
  { categoryId: 'toiletries', name: '여행용 샴푸 & 바디워시', completed: false },
  { categoryId: 'toiletries', name: '개인 수건', completed: false },
  { categoryId: 'toiletries', name: '스킨케어 제품 및 자외선 차단제', completed: false },
  { categoryId: 'toiletries', name: '면도기 / 여성용품', completed: false },

  // 전자기기
  { categoryId: 'electronics', name: '스마트폰', completed: false },
  { categoryId: 'electronics', name: '해외용 멀티 어댑터 (돼지코)', completed: false },
  { categoryId: 'electronics', name: '고속 충전기 및 케이블', completed: false },
  { categoryId: 'electronics', name: '보조배터리 (반드시 기내 휴대!)', completed: false },
  { categoryId: 'electronics', name: '이어폰 (기내 엔터테인먼트용)', completed: false },
  { categoryId: 'electronics', name: '카메라 및 여분의 메모리카드', completed: false },

  // 건강 및 위생
  { categoryId: 'health', name: '개인 상비약 (지사제, 소화제, 해열제, 밴드)', completed: false },
  { categoryId: 'health', name: '마스크 및 손 소독제', completed: false },
  { categoryId: 'health', name: '물티슈 및 휴대용 휴지', completed: false },
  { categoryId: 'health', name: '소화효소 또는 비타민', completed: false },

  // 기타
  { categoryId: 'etc', name: '접이식 우산 / 양산', completed: false },
  { categoryId: 'etc', name: '자외선 차단 선글라스', completed: false },
  { categoryId: 'etc', name: '여행용 캐리어 & 백팩', completed: false },
  { categoryId: 'etc', name: '기내용 목베개 및 안대', completed: false },
  { categoryId: 'etc', name: '비상용 간식', completed: false },
];

export const generateDefaultItems = (tripType: TripType): ChecklistItem[] => {
  const baseItems = tripType === 'international' ? INTERNATIONAL_DEFAULT_ITEMS : DOMESTIC_DEFAULT_ITEMS;
  const now = Date.now();
  return baseItems.map((item, index) => ({
    ...item,
    id: `item-${tripType}-${now}-${index}`,
    isCustom: false,
    createdAt: now + index,
  }));
};
