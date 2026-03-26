/**
 * generateQuestion.js
 * Sinh câu hỏi toán học với Adaptive Learning:
 *   - Theo dõi năng lực (localStorage "userStats")
 *   - Điều chỉnh giới hạn số theo skill level
 *   - Ưu tiên phép tính mà người dùng hay sai
 *   - Bonus: streak >= 5 tăng độ khó tạm thời
 */

// ═══════════════════════════════════════════════════════════
// PHẦN 1: USER STATS
// ═══════════════════════════════════════════════════════════

const DEFAULT_STATS = {
  addition:    { correct: 0, wrong: 0 },
  subtraction: { correct: 0, wrong: 0 },
};

/**
 * Đọc stats từ localStorage (fallback về mặc định)
 */
function readStats() {
  try {
    const raw = localStorage.getItem('userStats');
    return raw ? JSON.parse(raw) : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

/**
 * updateStats – Cập nhật thống kê sau mỗi câu trả lời
 * @param {{ operator: string }} question - Câu hỏi vừa trả lời
 * @param {boolean} isCorrect
 */
export function updateStats(question, isCorrect) {
  const stats = readStats();
  const type  = question.operator === '+' ? 'addition' : 'subtraction';

  if (isCorrect) {
    stats[type].correct += 1;
  } else {
    stats[type].wrong += 1;
  }

  try {
    localStorage.setItem('userStats', JSON.stringify(stats));
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════
// PHẦN 2: SKILL LEVEL
// ═══════════════════════════════════════════════════════════

/**
 * getSkillLevel – Tính cấp độ dựa trên accuracy tổng
 * @param {number} [streakBoost=0] - Tạm thời tăng khi streak >= 5
 * @returns {"easy" | "medium" | "hard"}
 */
export function getSkillLevel(streakBoost = 0) {
  const stats = readStats();
  const totalCorrect = stats.addition.correct + stats.subtraction.correct;
  const totalWrong   = stats.addition.wrong   + stats.subtraction.wrong;
  const totalAnswered = totalCorrect + totalWrong;

  // Chưa đủ dữ liệu → medium
  if (totalAnswered === 0) return 'medium';

  const accuracy = totalCorrect / totalAnswered;

  // Streak bonus: nếu streak >= 5, cộng thêm 0.1 vào accuracy ảo
  const boostedAccuracy = accuracy + streakBoost * 0.1;

  if (boostedAccuracy > 0.8) return 'hard';
  if (boostedAccuracy < 0.5) return 'easy';
  return 'medium';
}

// ═══════════════════════════════════════════════════════════
// PHẦN 3: CÁC HÀM SINH CÂU HỎI GỐC
// ═══════════════════════════════════════════════════════════

/** Random số nguyên trong [min, max] */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sinh câu hỏi thông thường (không adaptive) – dùng làm fallback
 */
export function generateQuestion() {
  const operator = Math.random() < 0.5 ? '+' : '-';
  let a, b;

  if (operator === '+') {
    a = randInt(0, 10);
    b = randInt(0, 10 - a);
  } else {
    a = randInt(0, 10);
    b = randInt(0, a);
  }

  const answer = operator === '+' ? a + b : a - b;

  return { question: `${a} ${operator} ${b}`, answer, operator, a, b };
}

/**
 * Sinh 4 đáp án: 1 đúng + 3 sai hợp lý
 */
export function generateChoices(correctAnswer) {
  const choices = new Set([correctAnswer]);
  const offsets = [-3, -2, -1, 1, 2, 3].sort(() => Math.random() - 0.5);

  for (const offset of offsets) {
    if (choices.size >= 4) break;
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate <= 10) choices.add(candidate);
  }

  // fallback biên
  for (let n = 0; n <= 10 && choices.size < 4; n++) choices.add(n);

  return [...choices].sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// PHẦN 4: ADAPTIVE QUESTION GENERATION
// ═══════════════════════════════════════════════════════════

/**
 * generateAdaptiveQuestion – Sinh câu hỏi theo skill level và điểm yếu
 *
 * Logic:
 *  1. Xác định skill level → giới hạn max số
 *  2. Ưu tiên phép tính có tỉ lệ sai cao hơn
 *  3. Nếu streak >= 5 → boost thêm 1 bậc khó
 *
 * @param {number} [streak=0] - Streak hiện tại
 * @returns {{ question, answer, operator, a, b }}
 */
export function generateAdaptiveQuestion(streak = 0) {
  const stats = readStats();

  // Boost khi streak >= 5
  const streakBoost = streak >= 5 ? 1 : 0;
  const level = getSkillLevel(streakBoost);

  // Giới hạn số theo cấp độ
  // easy: 0-5 | medium: 0-10 | hard: 0-10 (nhưng đảm bảo cả 2 số đều lớn)
  const maxVal = level === 'easy' ? 5 : 10;

  // Ưu tiên phép tính mà người dùng hay sai
  // Nếu tỉ lệ sai cộng > trừ → ưu tiên cộng, ngược lại → ưu tiên trừ
  const addAccuracy     = getOperatorAccuracy(stats.addition);
  const subAccuracy     = getOperatorAccuracy(stats.subtraction);
  // Phép tính yếu hơn có xác suất cao hơn (70/30)
  let operator;
  if (addAccuracy === subAccuracy) {
    operator = Math.random() < 0.5 ? '+' : '-';
  } else {
    // Phép tính nào accuracy thấp hơn → ưu tiên 70%
    const weakOp = addAccuracy < subAccuracy ? '+' : '-';
    operator = Math.random() < 0.7 ? weakOp : (weakOp === '+' ? '-' : '+');
  }

  // Sinh số
  let a, b, answer;
  if (operator === '+') {
    a = randInt(0, maxVal);
    b = randInt(0, Math.min(maxVal, 10 - a)); // kết quả <= 10
    answer = a + b;
  } else {
    a = randInt(0, maxVal);
    b = randInt(0, a);    // kết quả >= 0
    answer = a - b;
  }

  // Hard level: đảm bảo ít nhất 1 số >= 6 để thực sự khó
  if (level === 'hard' && a < 6 && b < 6 && operator === '+') {
    a = randInt(5, 10);
    b = randInt(0, 10 - a);
    answer = a + b;
  }

  return { question: `${a} ${operator} ${b}`, answer, operator, a, b };
}

/** Tính accuracy cho một loại phép tính */
function getOperatorAccuracy(opStats) {
  const total = opStats.correct + opStats.wrong;
  if (total === 0) return 1; // Chưa có data → xem như đều nhau
  return opStats.correct / total;
}

// ═══════════════════════════════════════════════════════════
// PHẦN 5: SINH TẬP CÂU HỎI
// ═══════════════════════════════════════════════════════════

/**
 * generateQuestionList – Sinh N câu thông thường (không adaptive)
 * Giữ lại để không phá logic cũ khi cần fallback
 */
export function generateQuestionList(total = 20) {
  const questions = [];
  let lastQuestion = null;

  for (let i = 0; i < total; i++) {
    let q;
    do {
      q = generateQuestion();
    } while (lastQuestion && q.question === lastQuestion.question);

    questions.push({ ...q, choices: generateChoices(q.answer), id: i });
    lastQuestion = q;
  }

  return questions;
}

/**
 * generateAdaptiveSet – Sinh N câu hỏi theo adaptive algorithm
 * Mỗi câu có thể khác nhau về level vì streak thay đổi giữa chừng,
 * nhưng để đơn giản ta snapshot streak=0 lúc generate (streak thực tế
 * được truyền vào realtime từ Quiz khi cần boost đặc biệt).
 *
 * @param {number} total
 * @param {number} [currentStreak=0]
 */
export function generateAdaptiveSet(total = 20, currentStreak = 0) {
  const questions = [];
  let lastQuestion = null;

  for (let i = 0; i < total; i++) {
    let q;
    let attempts = 0;
    do {
      q = generateAdaptiveQuestion(currentStreak);
      attempts++;
    } while (lastQuestion && q.question === lastQuestion.question && attempts < 10);

    questions.push({ ...q, choices: generateChoices(q.answer), id: i });
    lastQuestion = q;
  }

  return questions;
}
