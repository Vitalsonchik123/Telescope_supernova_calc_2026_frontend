import { useState } from 'react';
import type { FC } from 'react';
import { mockTelescopes } from '../modules/mockTelescopes';
import { Button } from 'react-bootstrap';
// Импортируем дефолтное видео
import defaultVideo from '../assets/default-video.mp4';

export const FeedPage: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const telescope = mockTelescopes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockTelescopes.length);
  };

  // Если видео нет, используем локальное
  const videoSrc = telescope.videoUrl ? telescope.videoUrl : defaultVideo;

  return (
    <div style={{ position: 'relative', height: '100vh', backgroundColor: '#000' }}>
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
      />
      <div style={{ position: 'absolute', bottom: '80px', left: '20px', right: '20px', color: 'white' }}>
        <h2>{telescope.name}</h2>
        <p>{telescope.description}</p>
        <p>Диаметр: {telescope.aperture_cm} см | Поле зрения: {telescope.fov_deg}°</p>
        <Button variant="primary" onClick={handleNext} className="mt-3 w-100">
          Следующий →
        </Button>
      </div>
    </div>
  );
};
