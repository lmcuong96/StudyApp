import React, { useState } from 'react';

/**
 * ReviewModal – Modal xem lại toàn bộ 20 câu hỏi
 *
 * Props:
 *   - questions   (Array)    : Danh sách câu hỏi
 *   - userAnswers (number[]) : Đáp án người dùng
 *   - score       ({ correct, total, date }?) : Tóm tắt – nếu mở từ history
 *   - onClose     (fn)       : Đóng modal
 */
const ReviewModal = ({ questions, userAnswers, score, onClose }) => {
  // Tính lại correctCount từ data thực tế (chính xác hơn field càch)
  const correctCount = questions.reduce(
    (n, q, i) => n + (userAnswers[i] === q.answer ? 1 : 0), 0
  );

  return (
    /* Overlay mờ – click ra ngoài để đóng */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      {/* Modal box – ngăn click lan ra overlay */}
      <div
        className="animate-modalFadeIn bg-white rounded-3xl shadow-2xl w-full max-w-lg
                   flex flex-col overflow-hidden"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <i className="fas fa-list-check text-indigo-500" />
            Xem lại chi tiết
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center
                       justify-center text-gray-500 hover:text-gray-700 transition-all active:scale-90"
            aria-label="Đóng"
          >
            <i className="fas fa-xmark text-lg" />
          </button>
        </div>

        {/* Score summary – chỉ hiện khi có prop score (mở từ history) */}
        {score && (
          <div className="flex items-center gap-4 px-6 py-3 bg-indigo-50 border-b border-indigo-100">
            <div className="flex-1">
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">
                {score.date}
              </p>
              <p className="text-lg font-extrabold text-indigo-700">
                {correctCount} / {questions.length} đúng
                <span className="text-sm font-medium text-gray-500 ml-2">
                  ({Math.round((correctCount / questions.length) * 100)}%)
                </span>
              </p>
            </div>
            {/* Mini progress bar */}
            <div className="w-24 h-2 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${Math.round((correctCount / questions.length) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Danh sách câu – có scroll */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i] === q.answer;
            return (
              <div
                key={q.id}
                className={`flex items-center justify-between rounded-xl px-4 py-3
                            border text-sm font-semibold
                            ${isCorrect
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50   border-red-200'}`}
              >
                {/* Số thứ tự + phép tính */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-400 font-bold w-6 shrink-0">{i + 1}.</span>
                  <span className="text-gray-800 font-bold text-base">{q.question} = ?</span>
                </div>

                {/* Đáp án + icon */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {/* Đáp án user */}
                  <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                    {userAnswers[i] ?? '—'}
                  </span>

                  {/* Đáp án đúng (chỉ show khi sai) */}
                  {!isCorrect && (
                    <span className="text-gray-400 text-xs">
                      / <span className="text-green-700 font-bold">{q.answer}</span>
                    </span>
                  )}

                  {/* Icon trạng thái */}
                  {isCorrect ? (
                    <i className="fas fa-check text-green-500 text-base" />
                  ) : (
                    <i className="fas fa-xmark text-red-500 text-base" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white
                       font-bold text-base active:scale-95 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
