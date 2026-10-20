import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ListChecks, Sparkles } from 'lucide-react';
import type { ChecklistStats } from '../types';

interface ProgressBarProps {
  stats: ChecklistStats;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  const { total, completed, remaining, percentage } = stats;
  const isAllDone = total > 0 && completed === total;
  const hasFiredConfetti = useRef(false);

  useEffect(() => {
    if (isAllDone && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#10b981', '#fbbf24', '#f43f5e'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    } else if (!isAllDone) {
      hasFiredConfetti.current = false;
    }
  }, [isAllDone]);

  // Encouragement text based on percentage
  const getEncouragementText = () => {
    if (total === 0) return '준비물을 추가하여 체크리스트를 시작하세요!';
    if (isAllDone) return '모든 준비물을 완벽하게 챙기셨습니다! ✈️';
    if (percentage >= 80) return '거의 다 왔어요! 마지막 필수품을 확인하세요 💪';
    if (percentage >= 50) return '절반 이상 준비 완료! 순조롭게 진행 중입니다 ✨';
    if (percentage > 0) return '여행 준비가 착착 진행되고 있어요! 🧳';
    return '하나씩 체크하며 설레는 여행을 준비해보세요!';
  };

  return (
    <section className="progress-section" aria-label="준비 진행률">
      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-title-wrap">
            <span className="progress-badge">
              <ListChecks size={15} /> 진행 현황
            </span>
            <h3 className="progress-headline">준비 진행률</h3>
          </div>
          <div className="progress-percent-display">
            <span className="percent-number">{percentage}</span>
            <span className="percent-unit">%</span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {percentage > 10 && (
              <span className="progress-bar-glow" />
            )}
          </div>
        </div>

        {/* Statistics 4-card metric grid */}
        <div className="progress-stats-grid">
          <div className="stat-box">
            <span className="stat-label">전체 준비물</span>
            <div className="stat-value-group">
              <span className="stat-value">{total}</span>
              <span className="stat-unit">개</span>
            </div>
          </div>

          <div className="stat-box completed">
            <span className="stat-label">준비 완료</span>
            <div className="stat-value-group">
              <span className="stat-value text-completed">{completed}</span>
              <span className="stat-unit">개</span>
            </div>
          </div>

          <div className="stat-box remaining">
            <span className="stat-label">남은 준비물</span>
            <div className="stat-value-group">
              <span className="stat-value text-remaining">{remaining}</span>
              <span className="stat-unit">개</span>
            </div>
          </div>

          <div className="stat-box rate">
            <span className="stat-label">준비 완료율</span>
            <div className="stat-value-group">
              <span className="stat-value text-rate">{percentage}</span>
              <span className="stat-unit">%</span>
            </div>
          </div>
        </div>

        {/* All done celebration message or encouragement message */}
        {isAllDone ? (
          <div className="celebration-banner">
            <div className="celebration-icon-box">
              <Sparkles size={24} className="sparkle-active" />
            </div>
            <div className="celebration-content">
              <h4 className="celebration-title">🎉 여행 준비 완료!</h4>
              <p className="celebration-desc">
                모든 짐을 빠짐없이 챙기셨습니다. 즐겁고 안전한 여행 되세요! ✈️
              </p>
            </div>
          </div>
        ) : (
          <div className="progress-footnote">
            <span className="footnote-text">{getEncouragementText()}</span>
          </div>
        )}
      </div>
    </section>
  );
};
