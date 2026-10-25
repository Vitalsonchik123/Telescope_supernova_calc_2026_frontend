import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { GridPage } from './pages/GridPage';
import { StubPage } from './pages/StubPage';
import { BottomTabBar } from './components/BottomTabBar';
import './App.css'; // Подключаем стили

function App() {
  return (
    <BrowserRouter>
      {/* Обертка app-wrapper задает мобильную ширину и цвет фона */}
      <div className="app-wrapper">
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/grid" element={<GridPage />} />
            <Route path="/add" element={<StubPage />} />
            <Route path="/login" element={<StubPage />} />
          </Routes>
        </div>

        {/* Панель вкладок всегда внизу */}
        <BottomTabBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
