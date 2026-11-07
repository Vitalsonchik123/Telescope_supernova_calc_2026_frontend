import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import defaultVideo from '../assets/default-video.mp4';
import defaultImage from '../assets/default-image.jpg';
import { TelescopesService } from '../api/generated';
import { HeartFill } from 'react-bootstrap-icons';

export const FeedPage = () => {
  const [telescope, setTelescope] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (id?: number, next: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await TelescopesService.getFeed(id, next);
      const actualTelescope = response.data ? response.data : response;
      setTelescope(actualTelescope);
    } catch (err: any) {
      console.error(err);
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

  const videoSrc = telescope.video_url || defaultVideo;
  const imageSrc = telescope.image_url || defaultImage;

  return (
    <div className="feed-container">
      {telescope.video_url ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="feed-video"
        />
      ) : (
        <img
          src={imageSrc}
          alt={telescope.name}
          className="feed-video"
          style={{ objectFit: 'cover' }}
        />
      )}

      <div className="feed-overlay">
        <div className="feed-top-row">
          <h1 className="feed-title">{telescope.name}</h1>
          <div className="feed-right-col">
            <span>Диаметр: {telescope.aperture_cm} см</span>
            <span>Поле зрения: {telescope.fov_deg}°</span>
            <span className="feed-likes">
              <HeartFill color="#FF9400" className="me-1 mb-1" />
              {telescope.likes_count || 0}
            </span>
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
