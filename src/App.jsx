import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Collection from './pages/Collection';
import { getRandomCard } from './data/players';

/**
 * App – Root component
 * Routing: 'home' | 'quiz' | 'collection'
 */
function App() {
  const [page, setPage] = useState('home');
  const [level, setLevel] = useState(null);

  // Lịch sử làm bài
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mathGameHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mathGameHistory', JSON.stringify(history));
    } catch {}
  }, [history]);

  // ── Handlers ──
  const handleSelectLevel = (selectedLevel) => {
    setLevel(selectedLevel);
    setPage('quiz');
  };

  const handleHome = () => {
    setPage('home');
    setLevel(null);
  };

  const handleCollection = () => setPage('collection');

  const handleSaveHistory = (record) => {
    setHistory((prev) => [...prev, record]);
  };

  // Random card được chọn khi bắt đầu quiz (truyền xuống Quiz → RewardCard)
  // Quiz tự gọi getRandomCard qua reducer, App không cần quản lý ở đây

  return (
    <div className="min-h-screen">
      {page === 'home' && (
        <Home
          onSelectLevel={handleSelectLevel}
          onCollection={handleCollection}
          history={history}
        />
      )}
      {page === 'quiz' && (
        <Quiz
          level={level}
          onHome={handleHome}
          onSaveHistory={handleSaveHistory}
        />
      )}
      {page === 'collection' && (
        <Collection onHome={handleHome} />
      )}
    </div>
  );
}

export default App;
