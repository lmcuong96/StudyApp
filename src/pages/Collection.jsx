import React, { useState, useEffect } from 'react';
import PlayerCard from '../components/PlayerCard';
import { RARITY_ORDER, RARITY_CONFIG } from '../data/players';

/**
 * Collection – Trang bộ sưu tập card cầu thủ
 * Đọc từ localStorage key "collection", sắp xếp theo rarity
 *
 * Props:
 *   - onHome (fn): Về trang chủ
 */
const Collection = ({ onHome }) => {
  const [cards, setCards] = useState([]);

  // Đọc collection từ localStorage khi mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('collection');
      const raw = saved ? JSON.parse(saved) : [];

      // Sắp xếp theo rarity: legendary > epic > rare > common
      const sorted = [...raw].sort((a, b) => {
        return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
      });

      setCards(sorted);
    } catch {
      setCards([]);
    }
  }, []);

  // Đếm số card theo từng rarity
  const countByRarity = RARITY_ORDER.reduce((acc, r) => {
    acc[r] = cards.filter((c) => c.rarity === r).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-indigo-600 font-semibold
                       hover:text-indigo-800 transition-colors"
          >
            <i className="fas fa-arrow-left" />
            Trang chủ
          </button>
          <h1 className="text-2xl font-extrabold text-indigo-800 flex items-center gap-2">
            <i className="fas fa-layer-group text-indigo-400" />
            Bộ Sưu Tập
          </h1>
          <span className="text-sm font-bold text-gray-500">
            {cards.length} card
          </span>
        </div>

        {/* Thống kê nhanh theo rarity */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {RARITY_ORDER.map((rarity) => {
            const cfg = RARITY_CONFIG[rarity];
            return (
              <div
                key={rarity}
                className={`${cfg.bgClass} ${cfg.textClass} rounded-2xl p-3 text-center shadow-md`}
              >
                <div className="text-2xl">{cfg.emoji}</div>
                <div className="text-xl font-extrabold">{countByRarity[rarity]}</div>
                <div className="text-xs font-semibold opacity-80">{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {/* Grid card */}
        {cards.length === 0 ? (
          /* State rỗng */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🃏</div>
            <p className="text-xl font-bold text-gray-500">Chưa có card nào!</p>
            <p className="text-gray-400 mt-2 font-medium">
              Hoàn thành bài thi với ≥ 15/20 câu đúng để nhận card.
            </p>
            <button
              onClick={onHome}
              className="mt-6 bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl
                         hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Chơi ngay!
            </button>
          </div>
        ) : (
          /* Grid card (hiện ngay, không flip) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 justify-items-center animate-fadeInScale">
            {cards.map((card, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <PlayerCard player={card} noFlip />
                {card.receivedAt && (
                  <span className="text-xs text-gray-400 font-medium">{card.receivedAt}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
