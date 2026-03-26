import React, { useState } from 'react';
import ReviewModal from './ReviewModal';
import PlayerCard from './PlayerCard';
import { getRandomCard, players } from '../data/players';

/**
 * ResultScreen – Màn hình kết quả + toàn bộ reward flow (state machine)
 *
 * Props:
 *   - questions   (Array)    : Danh sách câu hỏi
 *   - userAnswers (number[]) : Đáp án người dùng
 *   - level       (number)   : Cấp độ 1 | 2
 *   - onReplay    (fn)       : Chơi lại
 *   - onHome      (fn)       : Về trang chủ
 *
 * Reward State Machine:
 *   idle → revealing → revealed → claimed
 */

const REWARD_THRESHOLD = 15; // Số câu đúng tối thiểu để nhận thưởng

// ─── Helper: lưu card vào collection, tránh duplicate ───────────────────────
function saveToCollection(card) {
  try {
    const stored = JSON.parse(localStorage.getItem('collection')) || [];

    // Kiểm tra trùng (cùng tên + rating)
    const exists = stored.some(
      (c) => c.name === card.name && c.rating === card.rating
    );

    if (!exists) {
      const updated = [
        ...stored,
        { ...card, receivedAt: new Date().toLocaleDateString('vi-VN') },
      ];
      localStorage.setItem('collection', JSON.stringify(updated));
    }
  } catch {
    // Bỏ qua lỗi localStorage (private browsing, v.v.)
  }
}

const ResultScreen = ({ questions, userAnswers, level, onReplay, onHome }) => {
  // ─── Review modal ────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);

  // ─── Reward state machine ────────────────────────────────────────────────
  // "idle" | "revealing" | "revealed" | "claimed"
  const [rewardState, setRewardState] = useState('idle');

  // Card được generate một lần duy nhất khi bắt đầu reveal
  const [rewardCard, setRewardCard] = useState(null);

  // Flag chống nhận thưởng nhiều lần
  const [hasClaimed, setHasClaimed] = useState(false);

  // ─── Tính điểm ──────────────────────────────────────────────────────────
  const correctCount = questions.reduce((count, q, i) => {
    return count + (userAnswers[i] === q.answer ? 1 : 0);
  }, 0);

  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const canReceiveReward = correctCount >= REWARD_THRESHOLD;

  const getMessage = () => {
    if (percentage === 100) return { text: 'Tuyệt vời! Hoàn hảo! 🏆', color: 'text-yellow-500' };
    if (percentage >= 80)   return { text: 'Giỏi lắm! Cố lên nhé! 🌟', color: 'text-indigo-600' };
    if (percentage >= 60)   return { text: 'Khá tốt! Luyện thêm nha! 👍', color: 'text-blue-600' };
    return { text: 'Cố gắng thêm nhé! 💪', color: 'text-orange-500' };
  };
  const message = getMessage();

  // ─── Handlers Reward ────────────────────────────────────────────────────

  /**
   * Bước 1: Người dùng click "Nhận thưởng"
   * - Anti-spam: chỉ cho phép khi đang ở trạng thái idle
   * - Generate card 1 lần duy nhất, sau đó animate revealing → revealed
   */
  const handleReveal = () => {
    if (hasClaimed || rewardState !== 'idle') return;

    // Generate card ngay khi bắt đầu reveal (chỉ 1 lần)
    const card = getRandomCard(players);
    setRewardCard(card);
    setRewardState('revealing');

    // Sau 1s flip xong → chuyển sang revealed
    setTimeout(() => {
      setRewardState('revealed');
    }, 1000);
  };

  /**
   * Bước 2: Người dùng click "Xác nhận nhận thưởng"
   * - Chỉ khi rewardState === "revealed"
   * - Lưu vào collection đúng 1 lần
   * - Set hasClaimed = true để disable toàn bộ
   */
  const handleClaim = () => {
    if (hasClaimed || rewardState !== 'revealed') return;

    saveToCollection(rewardCard); // ✅ Chỉ save trong onClick, không dùng useEffect
    setHasClaimed(true);
    setRewardState('claimed');
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Modal xem lại chi tiết */}
      {showModal && (
        <ReviewModal
          questions={questions}
          userAnswers={userAnswers}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="animate-fadeInScale max-w-2xl mx-auto">

        {/* ── Score Summary ── */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Kết Quả Bài Làm</h2>
          <p className={`text-xl font-bold mb-4 ${message.color}`}>{message.text}</p>

          {/* Vòng tròn điểm */}
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600
                            flex flex-col items-center justify-center shadow-lg">
              <span className="text-4xl font-extrabold text-white">{correctCount}</span>
              <span className="text-sm text-white opacity-80">/ {total} đúng</span>
            </div>
          </div>

          <p className="text-lg font-semibold text-gray-600">
            Tỉ lệ đúng:{' '}
            <span className="text-indigo-600 font-extrabold">{percentage}%</span>
          </p>
        </div>

        {/* ── Reward Section ── */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

          {/* ── idle: chưa nhận ── */}
          {canReceiveReward && rewardState === 'idle' && (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 flex items-center gap-3 w-full">
                <span className="text-2xl">🎉</span>
                <p className="font-semibold text-yellow-700">
                  Xuất sắc! Bạn đủ điều kiện nhận card cầu thủ!
                </p>
              </div>
              <button
                onClick={handleReveal}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500
                           text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg
                           hover:from-yellow-500 hover:to-orange-600 hover:scale-105
                           active:scale-95 transition-all duration-200"
              >
                <i className="fas fa-gift" />
                Nhận thưởng!
              </button>
            </div>
          )}

          {/* ── revealing: đang lật thẻ ── */}
          {(rewardState === 'revealing' || rewardState === 'revealed') && rewardCard && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 font-medium text-sm">
                {rewardState === 'revealing' ? 'Đang mở thẻ...' : 'Bạn nhận được!'}
              </p>

              {/* PlayerCard: flipDelay=0 vì card đã được set khi revealing bắt đầu
                  noFlip=false → luôn chạy flip animation 1 lần */}
              <PlayerCard
                key={rewardCard.name} // key cố định để không re-mount
                player={rewardCard}
                flipDelay={100}       /*nhỏ để animation gần như ngay lập tức sau mount*/
                noFlip={rewardState === 'revealed'} /*khi revealed rồi thì không flip nữa*/
              />

              {/* ── revealed: nút xác nhận ── */}
              {rewardState === 'revealed' && !hasClaimed && (
                <button
                  onClick={handleClaim}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600
                             text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg
                             hover:from-green-600 hover:to-emerald-700 hover:scale-105
                             active:scale-95 transition-all duration-200 mt-2"
                >
                  <i className="fas fa-check" />
                  Xác nhận nhận thưởng
                </button>
              )}
            </div>
          )}

          {/* ── claimed: đã lưu ── */}
          {rewardState === 'claimed' && (
            <div className="flex flex-col items-center gap-3">
              {rewardCard && (
                <PlayerCard player={rewardCard} noFlip />
              )}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200
                              rounded-2xl px-5 py-3">
                <i className="fas fa-circle-check text-green-500 text-xl" />
                <p className="font-bold text-green-700">
                  Đã nhận thưởng! Card đã được lưu vào bộ sưu tập ✅
                </p>
              </div>
            </div>
          )}

          {/* Không đủ điều kiện */}
          {!canReceiveReward && (
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3">
              <span className="text-2xl">🎯</span>
              <p className="font-semibold text-orange-600">
                Cần đúng ít nhất{' '}
                <span className="font-extrabold">{REWARD_THRESHOLD}/{total}</span>{' '}
                câu để nhận thưởng. Bạn được{' '}
                <span className="font-extrabold">{correctCount}</span> câu!
              </p>
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {/* Xem lại chi tiết */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white border-2 border-indigo-300
                       text-indigo-700 font-bold text-lg px-8 py-4 rounded-2xl shadow-md
                       hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fas fa-magnifying-glass" />
            Xem lại chi tiết
          </button>

          {/* Chơi lại */}
          <button
            onClick={onReplay}
            className="flex items-center gap-2 bg-white border-2 border-gray-300
                       text-gray-600 font-bold text-lg px-8 py-4 rounded-2xl shadow-md
                       hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fas fa-rotate-left" />
            Chơi lại
          </button>

          {/* Trang chủ */}
          <button
            onClick={onHome}
            className="flex items-center gap-2 bg-white border-2 border-gray-300
                       text-gray-500 font-bold text-lg px-8 py-4 rounded-2xl shadow-md
                       hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fas fa-house" />
            Trang chủ
          </button>
        </div>
      </div>
    </>
  );
};

export default ResultScreen;
