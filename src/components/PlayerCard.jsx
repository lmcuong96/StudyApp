import React, { useState, useEffect } from 'react';
import { RARITY_CONFIG } from '../data/players';

/**
 * PlayerCard – Phong cách FIFA Ultimate Team
 *
 * Layers (từ dưới lên):
 *   1. Background image / fallback gradient
 *   2. Gradient overlay (bottom-up, text legibility)
 *   3. Legendary pulse glow (legendary only)
 *   4. Shine sweep (hover)
 *   5. Content (rating, name, rarity)
 *
 * Props:
 *   - player     ({ name, rarity, rating, image? })
 *   - flipDelay  (number, mặc định 1000) ms trước khi flip reveal
 *   - noFlip     (boolean) hiện ngay, bỏ qua flip
 */

/** Shadow glow theo rarity */
const RARITY_GLOW = {
  legendary: 'shadow-[0_0_24px_6px_rgba(250,204,21,0.55)]',
  epic:      'shadow-[0_0_20px_4px_rgba(168,85,247,0.5)]',
  rare:      'shadow-[0_0_18px_4px_rgba(59,130,246,0.45)]',
  common:    'shadow-[0_0_12px_2px_rgba(156,163,175,0.3)]',
};

/** Gradient fallback khi không có ảnh */
const RARITY_FALLBACK = {
  legendary: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-700',
  epic:      'bg-gradient-to-br from-purple-500 via-purple-700 to-indigo-800',
  rare:      'bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900',
  common:    'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700',
};

const PlayerCard = ({ player, flipDelay = 1000, noFlip = false }) => {
  const [revealed, setRevealed] = useState(noFlip);
  const [flipping, setFlipping] = useState(false);
  const [imgError, setImgError] = useState(false);

  const config     = RARITY_CONFIG[player?.rarity] ?? RARITY_CONFIG.common;
  const glow       = RARITY_GLOW[player?.rarity]    ?? RARITY_GLOW.common;
  const fallbackBg = RARITY_FALLBACK[player?.rarity] ?? RARITY_FALLBACK.common;
  const hasImage   = !!(player?.image) && !imgError;

  // ── Flip animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (noFlip) return;
    const t1 = setTimeout(() => {
      setFlipping(true);
      const t2 = setTimeout(() => {
        setRevealed(true);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(t2);
    }, flipDelay);
    return () => clearTimeout(t1);
  }, [flipDelay, noFlip]);

  // ── Preload ảnh (background-image không có onError) ───────────────────────
  useEffect(() => {
    if (!player?.image) return;
    const img   = new window.Image();
    img.src     = player.image;
    img.onerror = () => setImgError(true);
    img.onload  = () => setImgError(false);
  }, [player?.image]);

  if (!player) return null;

  return (
    <div
      className={`
        relative w-48 h-72 rounded-2xl overflow-hidden cursor-pointer select-none
        border-2 ${config.border} ${glow}
        ${!hasImage ? fallbackBg : ''}
        transition-all duration-300
        hover:scale-105 hover:brightness-110
        ${flipping ? 'animate-flipCard' : ''}
      `}
      style={hasImage ? {
        backgroundImage:    `url(${player.image})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center top',
      } : {}}
    >
      {revealed ? (
        <>
          {/* ── Layer 1: Gradient overlay bottom-up ── */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* ── Layer 2: Legendary pulse (legendary only) ── */}
          {player.rarity === 'legendary' && (
            <div className="absolute inset-0 bg-yellow-400/10 animate-pulse pointer-events-none" />
          )}

          {/* ── Layer 3: Shine sweep on hover ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          opacity-0 hover:opacity-100 transition-opacity duration-300
                          -translate-x-full hover:translate-x-full pointer-events-none" />

          {/* ── Rating – góc trên trái ── */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-4xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                             leading-none">
              {player.rating}
            </span>
          </div>

          {/* ── Rarity emoji – góc trên phải ── */}
          <div className="absolute top-3 right-3 z-10 text-xl drop-shadow-md">
            {config.emoji}
          </div>

          {/* ── Content block – bottom ── */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-3">
            {/* Tên cầu thủ */}
            <p className="text-lg font-extrabold text-white leading-tight tracking-wide
                          drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate">
              {player.name}
            </p>

            {/* Rarity label */}
            <p className={`text-xs font-bold uppercase tracking-widest mt-0.5
                           ${player.rarity === 'legendary' ? 'text-yellow-300' :
                             player.rarity === 'epic'      ? 'text-purple-300' :
                             player.rarity === 'rare'      ? 'text-blue-300'   :
                                                             'text-gray-300'}`}>
              {config.label}
            </p>
          </div>
        </>
      ) : (
        /* ── Mặt sau: ẩn thông tin ── */
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
          {/* Pattern chéo */}
          <div className="absolute inset-0 opacity-[0.08]"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
                 backgroundSize: '14px 14px',
               }} />
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <span className="text-5xl drop-shadow-lg">🃏</span>
            <span className="text-2xl font-extrabold text-white/60 tracking-[0.3em]">???</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerCard;
