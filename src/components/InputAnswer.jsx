import React, { useState, useRef } from 'react';

/**
 * InputAnswer - Ô nhập kết quả (Level 2)
 * Props:
 *   - correctAnswer (number): Đáp án đúng của câu hỏi hiện tại
 *   - onAnswer (fn): Callback khi hoàn thành (sau độ trễ feedback)
 */
const InputAnswer = ({ correctAnswer, onAnswer }) => {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  
  // Feedback states
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect]   = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    // Nếu đang hiển thị kết quả thì block không cho submit lại
    if (showResult) return;

    const num = parseInt(value, 10);

    // Kiểm tra hợp lệ: phải là số, trong phạm vi 0–10
    if (value === '' || isNaN(num) || num < 0 || num > 10) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }

    // Đánh giá đúng/sai
    const correct = (num === correctAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    // Tự động chuyển câu sau 1.5s
    setTimeout(() => {
      onAnswer(num);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="animate-slideInUp flex flex-col items-center">
      <div className={`flex gap-3 w-full max-w-sm ${shake ? 'animate-wiggle' : ''} 
                       ${showResult && isCorrect ? 'scale-105 transition-transform duration-300' : ''}`}>
        <input
          ref={inputRef}
          type="number"
          min="0"
          max="10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={showResult}
          placeholder="Nhập..."
          autoFocus
          className="flex-1 text-2xl font-bold text-center border-2 border-indigo-300 rounded-2xl px-4 py-4
                     focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200
                     bg-white text-indigo-800 shadow-md transition-all disabled:bg-gray-100 disabled:opacity-80"
        />
        <button
          onClick={handleSubmit}
          disabled={showResult}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg
                     px-6 py-4 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-700
                     active:scale-95 transition-all duration-200 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <i className="fas fa-check" />
          Xác nhận
        </button>
      </div>

      {/* Hiển thị Feedback */}
      <div className="h-8 mt-4 flex items-center justify-center w-full">
        {showResult ? (
          <div className={`text-xl font-bold animate-bounceIn px-6 py-2 rounded-full shadow-sm
                           ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600 animate-wiggle'}`}>
            {isCorrect ? (
              <>
                <i className="fas fa-check-circle mr-2" />
                Chính xác!
              </>
            ) : (
              <>
                <i className="fas fa-xmark-circle mr-2" />
                Sai! Đáp án: {correctAnswer}
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Nhập số từ 0 đến 10, rồi nhấn Xác nhận
          </p>
        )}
      </div>
    </div>
  );
};

export default InputAnswer;
