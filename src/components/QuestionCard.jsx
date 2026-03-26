import React from 'react';

/**
 * QuestionCard - Hiển thị câu hỏi toán học
 * Props:
 *   - question     (string) : Phép toán, vd: "3 + 4"
 *   - currentIndex (number) : Câu hiện tại (0-based)
 *   - total        (number) : Tổng số câu
 *   - level        (number) : Cấp độ UI (1 = trắc nghiệm | 2 = nhập số)
 *   - skillLevel   (string) : "easy" | "medium" | "hard" (từ adaptive engine)
 *   - streak       (number) : Chuỗi câu đúng liên tiếp
 */
const QuestionCard = ({ question, currentIndex, total, level, skillLevel = 'medium', streak = 0 }) => {
  const progress = (currentIndex / total) * 100;

  /** Config badge cấp độ năng lực */
  const SKILL_CONFIG = {
    easy:   { label: 'Dễ',       bg: 'bg-green-100',  text: 'text-green-700',  icon: '🌱' },
    medium: { label: 'Trung bình', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⭐' },
    hard:   { label: 'Khó',       bg: 'bg-red-100',    text: 'text-red-700',    icon: '🔥' },
  };
  const skill = SKILL_CONFIG[skillLevel] ?? SKILL_CONFIG.medium;

  return (
    <div className="animate-fadeInScale">
      {/* ── Row 1: badge mode + số câu ── */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
          {level === 1 ? '🎯 Trắc nghiệm' : '✏️ Nhập số'}
        </span>
        <span className="text-sm font-bold text-gray-600">
          Câu {currentIndex + 1} / {total}
        </span>
      </div>

      {/* ── Row 2: skill level + streak ── */}
      <div className="flex items-center justify-between mb-3">
        {/* Skill level badge */}
        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1
                          ${skill.bg} ${skill.text}`}>
          {skill.icon} Cấp độ: {skill.label}
        </span>

        {/* Streak – chỉ hiện khi >= 1 */}
        {streak > 0 && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1
                            transition-all duration-300
                            ${streak >= 5
                              ? 'bg-orange-100 text-orange-700 animate-wiggle'
                              : 'bg-amber-50 text-amber-600'}`}>
            🔥 Chuỗi đúng: {streak}
            {streak >= 5 && ' 🚀'}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="progress-bar h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Câu hỏi */}
      <div className="flex items-center justify-center bg-white rounded-3xl shadow-lg py-10 px-6 mb-6">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2 font-medium">Tính kết quả:</p>
          <p className="text-6xl font-extrabold text-indigo-700 tracking-wide">
            {question} = <span className="text-purple-500">?</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
