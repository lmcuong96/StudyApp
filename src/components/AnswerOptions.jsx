import React, { useState } from 'react';

/**
 * AnswerOptions - Hiển thị 4 lựa chọn trắc nghiệm (Level 1)
 * Props:
 *   - choices (number[]): Mảng 4 đáp án
 *   - correctAnswer (number): Đáp án đúng
 *   - onAnswer (fn): Callback khi người dùng chọn đáp án
 */
const AnswerOptions = ({ choices, correctAnswer, onAnswer }) => {
  // Lưu đáp án đã chọn (null = chưa chọn)
  const [selected, setSelected] = useState(null);

  const handleSelect = (choice) => {
    // Không cho chọn lại sau khi đã chọn
    if (selected !== null) return;
    setSelected(choice);

    // Delay nhẹ để thấy màu phản hồi trước khi chuyển câu
    setTimeout(() => {
      onAnswer(choice);
      setSelected(null);
    }, 700);
  };

  /**
   * Tính class màu cho từng đáp án:
   * - Chưa chọn: bg trắng + hover
   * - Đúng: xanh lá
   * - Sai: đỏ
   */
  const getButtonClass = (choice) => {
    const base =
      'w-full py-4 px-6 rounded-2xl text-2xl font-bold transition-all duration-300 border-2 cursor-pointer ';

    if (selected === null) {
      return base + 'bg-white border-indigo-200 text-indigo-800 hover:bg-indigo-50 hover:border-indigo-400 hover:scale-105 active:scale-95 shadow-md';
    }
    if (choice === correctAnswer) {
      return base + 'bg-green-100 border-green-500 text-green-800 scale-105 shadow-green-200 shadow-lg';
    }
    if (choice === selected) {
      return base + 'bg-red-100 border-red-500 text-red-800 shadow-red-200 shadow-lg';
    }
    return base + 'bg-white border-gray-200 text-gray-400 opacity-60';
  };

  return (
    <div className="grid grid-cols-2 gap-4 animate-slideInUp">
      {choices.map((choice) => (
        <button
          key={choice}
          onClick={() => handleSelect(choice)}
          className={getButtonClass(choice)}
          disabled={selected !== null}
        >
          {/* Icon phản hồi */}
          {selected !== null && choice === correctAnswer && (
            <i className="fas fa-check mr-2 text-green-600" />
          )}
          {selected !== null && choice === selected && choice !== correctAnswer && (
            <i className="fas fa-times mr-2 text-red-600" />
          )}
          {choice}
        </button>
      ))}
    </div>
  );
};

export default AnswerOptions;
