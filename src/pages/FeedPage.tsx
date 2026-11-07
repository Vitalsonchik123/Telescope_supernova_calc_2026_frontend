import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import defaultVideo from '../assets/default-video.mp4';
import { TelescopesService } from '../api/generated';

export const FeedPage = () => {
  const [telescope, setTelescope] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем первый элемент при монтировании
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (id?: number, next: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Вызов API ленты
      const data = await TelescopesService.getFeed(id, next);
      setTelescope(data);
    } catch (err: any) {
      setError('Ошибка загрузки ленты');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (telescope) {
      fetchFeed(telescope.id, true);
    }
  };

  if (isLoading && !telescope) {
    return (
      <Container className="text-center pt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return <Container className="text-center pt-5 text-danger">{error}</Container>;
  }

  if (!telescope) {
    return <Container className="text-center pt-5">Лента пуста</Container>;
  }

  // Обработка медиа (если бэкенд возвращает ключи MinIO, нужно склеить с URL MinIO)
  // Предполагаем, что бэкенд возвращает готовые URL, либо используем дефолтные
  const videoSrc = telescope.video_url || defaultVideo;

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
        <div className="feed-top-row">
          <h1 className="feed-title">{telescope.name}</h1>
          <div className="feed-right-col">
            <span>Диаметр: {telescope.aperture_cm} см</span>
            <span>Поле зрения: {telescope.fov_deg}°</span>
            <span className="feed-likes">❤ {telescope.likes_count || 0}</span>
          </div>
        </div>

        <p className="feed-desc">{telescope.description}</p>

        <div className="feed-bottom-bar">
          <Button
            className="next-arrow-btn"
            onClick={handleNext}
            disabled={isLoading}
            aria-label="Следующий"
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : '→'}
          </Button>
        </div>
      </div>
    </div>
  );
};
