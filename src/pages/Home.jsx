import React, { useState } from 'react';
import ReviewModal from '../components/ReviewModal';

/**
 * Home - Trang chủ chọn cấp độ
 * Props:
 *   - onSelectLevel (fn): Callback khi chọn cấp độ (1 hoặc 2)
 *   - history (Array): Lịch sử làm bài từ localStorage
 */
const Home = ({ onSelectLevel, onCollection, history }) => {
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);

  const openReview = (record) => {
    // Chỉ mở nếu record có đủ dữ liệu chi tiết
    if (record.questions && record.userAnswers) {
      setSelectedAttempt(record);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">

      {/* Logo / Header */}
      <div className="text-center mb-10 animate-bounceIn">
        <div className="text-7xl mb-4">🔢</div>
        <h1 className="text-5xl font-extrabold text-indigo-800 leading-tight">
          Học Toán
        </h1>
        <p className="text-2xl font-bold text-purple-600 mt-1">Vui Cùng Số Học!</p>
        <p className="text-gray-500 mt-2 text-base font-medium">
          Phép cộng &amp; trừ trong phạm vi 0 – 10
        </p>
      </div>

      {/* Chọn cấp độ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mb-10">
        {/* Level 1 */}
        <button
          onClick={() => onSelectLevel(1)}
          className="card-hover bg-gradient-to-br from-indigo-400 to-blue-600 text-white
                     rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl border-0
                     active:scale-95 cursor-pointer"
        >
          <div className="text-5xl">🎯</div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Cấp độ 1</p>
            <h2 className="text-2xl font-extrabold">Trắc Nghiệm</h2>
            <p className="text-sm opacity-80 mt-2 font-medium">
              Chọn đáp án đúng từ 4 lựa chọn
            </p>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-bold">
            20 câu
          </div>
        </button>

        {/* Level 2 */}
        <button
          onClick={() => onSelectLevel(2)}
          className="card-hover bg-gradient-to-br from-purple-400 to-pink-500 text-white
                     rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl border-0
                     active:scale-95 cursor-pointer"
        >
          <div className="text-5xl">✏️</div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Cấp độ 2</p>
            <h2 className="text-2xl font-extrabold">Nhập Số</h2>
            <p className="text-sm opacity-80 mt-2 font-medium">
              Tự tính và nhập kết quả vào ô
            </p>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-bold">
            20 câu
          </div>
        </button>
      </div>

      {/* Nút bộ sưu tập */}
      <button
        onClick={onCollection}
        className="card-hover flex items-center gap-3 bg-white border-2 border-indigo-200
                   text-indigo-700 font-bold text-lg px-8 py-4 rounded-2xl shadow-md mb-8
                   hover:bg-indigo-50 hover:border-indigo-400 active:scale-95 transition-all duration-200"
      >
        <i className="fas fa-layer-group text-indigo-400" />
        Bộ sưu tập 🃏
      </button>

      {/* Lịch sử làm bài */}
      {history && history.length > 0 && (
        <div className="w-full max-w-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <i className="fas fa-clock-rotate-left text-indigo-400" />
            Lịch sử gần đây
          </h3>
          <div className="space-y-2">
            {history.slice(-5).reverse().map((record, i) => {
              const canReview = !!(record.questions && record.userAnswers);
              return (
                <div
                  key={i}
                  onClick={() => openReview(record)}
                  className={`flex items-center justify-between bg-white rounded-2xl px-5 py-3 shadow-md
                              transition-all duration-150
                              ${canReview
                                ? 'cursor-pointer hover:bg-indigo-50 hover:shadow-lg hover:-translate-y-0.5'
                                : 'cursor-default opacity-70'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">{record.date}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${record.level === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                      Cấp {record.level}
                    </span>
                    {canReview && (
                      <span className="text-xs text-indigo-400 font-medium">
                        <i className="fas fa-magnifying-glass mr-1" />Xem lại
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-indigo-700">
                    {record.correct} / {record.total}
                    <span className="text-gray-400 text-sm font-medium ml-1">
                      ({Math.round((record.correct / record.total) * 100)}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-10 text-gray-400 text-sm font-medium">
        Chúc bé học tốt! 🌟
      </p>
      {isModalOpen && selectedAttempt && (
        <ReviewModal
          questions={selectedAttempt.questions}
          userAnswers={selectedAttempt.userAnswers}
          score={{ correct: selectedAttempt.correct, total: selectedAttempt.total, date: selectedAttempt.date }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
