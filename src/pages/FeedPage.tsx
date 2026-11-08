import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { RootState } from '../store';
import defaultVideo from '../assets/default-video.mp4';
import defaultImage from '../assets/default-image.jpg';
import { TelescopesService } from '../api/generated';
import { HeartFill } from 'react-bootstrap-icons';
import { mockTelescopes } from '../modules/mockTelescopes';

export const FeedPage = () => {
  const [telescope, setTelescope] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlId = searchParams.get('id');

  useEffect(() => {
    fetchFeed(urlId ? Number(urlId) : undefined, false);
  }, [urlId]);

  useEffect(() => {
    if (telescope) {
      // Поддержка likes_count (бэкенд) и likes (моки)
      const count = telescope.likes_count !== undefined ? telescope.likes_count : (telescope.likes || 0);
      setLikesCount(count);

      const storedLike = localStorage.getItem(`like_${telescope.id}`);
      if (storedLike !== null) {
        setIsLiked(storedLike === 'true');
      } else {
        setIsLiked(telescope.is_liked || false);
      }
    }
  }, [telescope]);

  const fetchFeed = async (id?: number, next: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await TelescopesService.getFeed(id, next);
      const actualTelescope = response.data ? response.data : response;
      setTelescope(actualTelescope);

      if (actualTelescope && actualTelescope.id) {
        setSearchParams({ id: String(actualTelescope.id) }, { replace: true });
      }
    } catch (err: any) {
      // FALLBACK (МОКИ)
      let mockTelescope = mockTelescopes[0];

      if (id) {
        const index = mockTelescopes.findIndex(t => t.id === id);
        if (index !== -1) {
          if (next) {
            const nextIndex = (index + 1) % mockTelescopes.length;
            mockTelescope = mockTelescopes[nextIndex];
          } else {
            mockTelescope = mockTelescopes[index];
          }
        }
      }

      setTelescope(mockTelescope);
      if (mockTelescope) {
        setSearchParams({ id: String(mockTelescope.id) }, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (telescope) {
      fetchFeed(telescope.id, true);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !telescope) return;

    setIsLiking(true);
    const prevIsLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevIsLiked);
    setLikesCount(prevIsLiked ? prevCount - 1 : prevCount + 1);

    try {
      const likeValue = prevIsLiked ? 0 : 1;
      await TelescopesService.postTelescopesLike(telescope.id, { like: likeValue });
      localStorage.setItem(`like_${telescope.id}`, String(!prevIsLiked));
    } catch (err) {
      console.error(err);
      setIsLiked(prevIsLiked);
      setLikesCount(prevCount);
      alert('Ошибка при лайке. Возможно, сервер недоступен.');
    } finally {
      setIsLiking(false);
    }
  };

  if (isLoading && !telescope) {
    return (
      <Container className="text-center pt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!telescope) {
    return <Container className="text-center pt-5">Лента пуста</Container>;
  }

  // Поддержка обоих форматов полей
  const videoSrc = telescope.video_url || telescope.videoUrl || defaultVideo;
  const imageSrc = telescope.image_url || telescope.imageUrl || defaultImage;
  const hasVideo = telescope.video_url || telescope.videoUrl;

  return (
    <div className="feed-container">
      {hasVideo ? (
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

            <div
              className="feed-likes"
              onClick={handleLike}
              style={{
                cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                opacity: isAuthenticated ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '5px'
              }}
            >
              {isLiking ? (
                <Spinner size="sm" animation="border" color="#FF9400" />
              ) : (
                <HeartFill
                  color={isLiked && isAuthenticated ? "#FF9400" : "#ccc"}
                  size={24}
                />
              )}
              <span>{likesCount}</span>
            </div>

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
