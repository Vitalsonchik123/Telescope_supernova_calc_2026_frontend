import { useState } from 'react';
import { mockTelescopes } from '../modules/mockTelescopes';
import defaultVideo from '../assets/default-video.mp4';

export const FeedPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const telescope = mockTelescopes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockTelescopes.length);
  };

  const videoSrc = telescope.videoUrl ? telescope.videoUrl : defaultVideo;

  return (
    <div className="feed-container">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="feed-video"
      />

      <div className="feed-overlay">
        {/* Название и параметры */}
        <div className="feed-top-row">
          <h1 className="feed-title">{telescope.name}</h1>
          <div className="feed-right-col">
            <span>Диаметр: {telescope.aperture_cm} см</span>
            <span>Поле зрения: {telescope.fov_deg}°</span>
            <span className="feed-likes">❤ {telescope.likes}</span>
          </div>
        </div>

        {/* Описание (без обсерватории, как вы просили) */}
        <p className="feed-desc">{telescope.description}</p>

        {/* Нижняя черная полоса со стрелкой */}
        <div className="feed-bottom-bar">
          <button className="next-arrow-btn" onClick={handleNext} aria-label="Следующий">
            →
          </button>
        </div>
      </div>
    </div>
  );
};
