import React, { useReducer, useEffect } from 'react';

import QuestionCard from '../components/QuestionCard';
import AnswerOptions from '../components/AnswerOptions';
import InputAnswer from '../components/InputAnswer';
import ResultScreen from '../components/ResultScreen';
import {
  generateAdaptiveSet,
  generateQuestionList,
  updateStats,
  getSkillLevel,
} from '../utils/generateQuestion';

/** Màn hình quiz – reward được quản lý trong ResultScreen */
const SCREEN = {
  PLAYING: 'playing',
  RESULT:  'result',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function quizReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        questions:    action.questions,
        userAnswers:  [],
        currentIndex: 0,
        screen:       SCREEN.PLAYING,
        streak:       0,               // chuỗi đúng liên tiếp
        skillLevel:   action.skillLevel,
      };

    case 'ANSWER': {
      const { answer, isCorrect } = action;
      const newAnswers  = [...state.userAnswers, answer];
      const nextIndex   = state.currentIndex + 1;
      const isDone      = nextIndex >= state.questions.length;

      // Cập nhật streak
      const newStreak = isCorrect ? state.streak + 1 : 0;

      return {
        ...state,
        userAnswers:  newAnswers,
        currentIndex: nextIndex,
        streak:       newStreak,
        screen: isDone ? SCREEN.RESULT : SCREEN.PLAYING,
      };
    }

    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
/**
 * Quiz – Trang làm bài (adaptive)
 * Props:
 *   - level         (number) : Cấp độ UI 1 | 2
 *   - onHome        (fn)
 *   - onSaveHistory (fn)
 */
const Quiz = ({ level, onHome, onSaveHistory }) => {
  const [state, dispatch] = useReducer(quizReducer, {
    questions:    [],
    userAnswers:  [],
    currentIndex: 0,
    screen:       SCREEN.PLAYING,
    streak:       0,
    skillLevel:   'medium',
  });

  // ── Init / Replay ───────────────────────────────────────────────────────
  const initQuiz = () => {
    // Snapshot skill level LÚC BẮT ĐẦU bài (không thay đổi giữa chừng)
    const skillLevel = getSkillLevel();

    // Dùng adaptive nếu có stats, fallback về normal nếu chưa
    const hasStats =
      localStorage.getItem('userStats') !== null;
    const questions = hasStats
      ? generateAdaptiveSet(20, 0)      // adaptive
      : generateQuestionList(20);       // fallback thông thường

    dispatch({ type: 'INIT', questions, skillLevel });
  };

  useEffect(() => { initQuiz(); }, []);

  // Lưu lịch sử khi vào màn kết quả
  useEffect(() => {
    if (state.screen === SCREEN.RESULT && state.userAnswers.length === 20) {
      const correct = state.questions.reduce(
        (count, q, i) => count + (state.userAnswers[i] === q.answer ? 1 : 0),
        0
      );
      onSaveHistory({
        level,
        correct,
        total:        state.questions.length,
        skillLevel:   state.skillLevel,
        date:         new Date().toLocaleDateString('vi-VN'),
        questions:    state.questions,    // để ReviewModal hiển thị chi tiết
        userAnswers:  state.userAnswers,
      });
    }
  }, [state.screen]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAnswer = (answer) => {
    const currentQuestion = state.questions[state.currentIndex];
    const isCorrect = answer === currentQuestion.answer;

    // Cập nhật stats ngay lập tức (không đợi re-render)
    updateStats(currentQuestion, isCorrect);

    dispatch({ type: 'ANSWER', answer, isCorrect });
  };

  const handleReplay = () => initQuiz();

  // ── Render ──────────────────────────────────────────────────────────────
  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-600 animate-pulse">
          Đang tải...
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      {/* Nút về trang chủ */}
      <div className="w-full max-w-xl mb-4">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-indigo-600 font-semibold
                     hover:text-indigo-800 transition-colors"
        >
          <i className="fas fa-arrow-left" />
          Trang chủ
        </button>
      </div>

      <div className="max-w-xl mx-auto w-full">

        {/* ── Đang làm bài ── */}
        {state.screen === SCREEN.PLAYING && currentQuestion && (
          <div key={state.currentIndex}>
            <QuestionCard
              question={currentQuestion.question}
              currentIndex={state.currentIndex}
              total={state.questions.length}
              level={level}
              skillLevel={state.skillLevel}   /* Adaptive: cấp độ năng lực */
              streak={state.streak}           /* Bonus: chuỗi đúng */
            />
            {level === 1 ? (
              <AnswerOptions
                choices={currentQuestion.choices}
                correctAnswer={currentQuestion.answer}
                onAnswer={handleAnswer}
              />
            ) : (
              <InputAnswer
                correctAnswer={currentQuestion.answer}
                onAnswer={handleAnswer}
              />
            )}
          </div>
        )}

        {/* ── Kết quả + reward ── */}
        {state.screen === SCREEN.RESULT && (
          <ResultScreen
            questions={state.questions}
            userAnswers={state.userAnswers}
            level={level}
            onReplay={handleReplay}
            onHome={onHome}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
