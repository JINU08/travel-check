import React from 'react';
import { Luggage, Sparkles, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Top brand bar */}
        <div className="brand-badge">
          <div className="brand-logo-wrap">
            <Luggage className="brand-logo-icon" size={20} />
          </div>
          <span className="brand-name">TRAVEL CHECK</span>
          <span className="brand-tag">
            <Sparkles size={13} className="sparkle-icon" /> 스마트 플래너
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="hero-section">
          <h1 className="hero-title">
            여행 준비, <span className="highlight-text">빠짐없이!</span>
          </h1>
          <p className="hero-description">
            체크 하나로 완성하는 나만의 여행 준비 리스트
          </p>
        </div>

        <div className="header-decor-plane" aria-hidden="true">
          <Compass size={24} className="decor-icon" />
        </div>
      </div>
    </header>
  );
};
