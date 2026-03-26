import React, { useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { RARITY_CONFIG } from '../data/players';

/**
 * RewardCard – Màn hình phần thưởng sau bài làm
 * - Hiển thị PlayerCard với flip animation
 * - Lưu card vào localStorage key "collection"
 *
 * Props:
 *   - player   ({ name, rarity, rating }) : Card được nhận
 *   - onReplay (fn)                       : Chơi lại
 *   - onHome   (fn)                       : Về trang chủ
 */
const RewardCard = ({ player, onReplay, onHome }) => {
  const config = RARITY_CONFIG[player?.rarity] ?? RARITY_CONFIG.common;

  // Lưu card vào collection trong localStorage khi component mount
  useEffect(() => {
    if (!player) return;
    try {
      const saved = localStorage.getItem('collection');
      const collection = saved ? JSON.parse(saved) : [];
      collection.push({ ...player, receivedAt: new Date().toLocaleDateString('vi-VN') });
      localStorage.setItem('collection', JSON.stringify(collection));
    } catch {
      // Bỏ qua nếu localStorage bị chặn
    }
  }, [player]);

  if (!player) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeInScale">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-1">🎉 Chúc mừng! 🎉</h2>
        <p className="text-gray-500 text-lg font-medium">
          Bạn nhận được card cầu thủ đặc biệt!
        </p>
      </div>

      {/* PlayerCard với flip animation */}
      <PlayerCard player={player} flipDelay={800} />

      {/* Thông điệp rarity sau khi flip (hiện sau 1.5s) */}
      <div className="mt-6 text-center animate-fadeInScale"
           style={{ animationDelay: '1.4s', animationFillMode: 'both', opacity: 0 }}>
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold
                          ${config.bgClass} ${config.textClass} shadow-md`}>
          {config.emoji} {config.label} Card!
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onReplay}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-bold text-lg px-7 py-3 rounded-2xl shadow-lg
                     hover:from-indigo-600 hover:to-purple-700 hover:scale-105
                     active:scale-95 transition-all duration-200"
        >
          <i className="fas fa-rotate-left" />
          Chơi lại
        </button>
        <button
          onClick={onHome}
          className="flex items-center gap-2 bg-white border-2 border-indigo-300 text-indigo-700
                     font-bold text-lg px-7 py-3 rounded-2xl shadow-md
                     hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <i className="fas fa-house" />
          Trang chủ
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
