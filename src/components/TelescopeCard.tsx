import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { TelescopesService } from '../api/generated';
import defaultImage from '../assets/default-image.jpg';
import { HeartFill } from 'react-bootstrap-icons';

interface Props {
  telescope: any;
  onRefresh: () => void;
}

export const TelescopeCard: FC<Props> = ({ telescope, onRefresh }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Читаем начальное состояние из бэкенда ИЛИ из localStorage
  const [isLiked, setIsLiked] = useState(
    telescope.is_liked || localStorage.getItem(`like_${telescope.id}`) === 'true'
  );
  const [likesCount, setLikesCount] = useState(telescope.likes_count || 0);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const imageSrc = telescope.image_url ? telescope.image_url : defaultImage;

  // Синхронизируем при обновлении пропсов (если бэкенд прислал новое число лайков)
  useEffect(() => {
    setLikesCount(telescope.likes_count || 0);
    // Если в localStorage есть запись, доверяем ей, иначе бэкенду
    const storedLike = localStorage.getItem(`like_${telescope.id}`);
    if (storedLike !== null) {
      setIsLiked(storedLike === 'true');
    } else {
      setIsLiked(telescope.is_liked || false);
    }
  }, [telescope.is_liked, telescope.likes_count, telescope.id]);

  const handleLike = async () => {
    if (!isAuthenticated) return;

    setIsLiking(true);
    const prevIsLiked = isLiked;
    const prevCount = likesCount;

    // Оптимистично обновляем UI
    setIsLiked(!prevIsLiked);
    setLikesCount(prevIsLiked ? prevCount - 1 : prevCount + 1);

    try {
      const likeValue = prevIsLiked ? 0 : 1;
      await TelescopesService.postTelescopesLike(telescope.id, { like: likeValue });

      // СОХРАНЯЕМ В LOCALSTORAGE, чтобы состояние не терялось
      localStorage.setItem(`like_${telescope.id}`, String(!prevIsLiked));

    } catch (e) {
      console.error(e);
      // Откатываем при ошибке
      setIsLiked(prevIsLiked);
      setLikesCount(prevCount);
      alert('Ошибка при лайке. Возможно, вы не авторизованы.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить этот телескоп?')) return;
    setIsDeleting(true);
    try {
      await TelescopesService.deleteTelescopes(telescope.id);
      onRefresh();
    } catch (e) {
      console.error(e);
      alert('Ошибка удаления');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user && telescope.user_id === user.id;

  const buttonColor = !isAuthenticated ? '#adb5bd' : (isLiked ? '#fff' : '#FF9400');
  const buttonBgColor = !isAuthenticated ? '#f8f9fa' : (isLiked ? '#FF9400' : '#fff');
  const buttonBorderColor = !isAuthenticated ? '#ced4da' : '#FF9400';

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imageSrc}
        style={{ height: '120px', objectFit: 'cover' }}
      />
      <Card.Body className="p-2 d-flex flex-column justify-content-between">
        <div>
          <Card.Title style={{ fontSize: '14px', marginBottom: '5px' }}>
            {telescope.name}
          </Card.Title>
          <Card.Text className="text-muted" style={{ fontSize: '12px' }}>
            <HeartFill
              color={isLiked && isAuthenticated ? "#FF9400" : "#ccc"}
              className="me-1 mb-1"
            />
            {likesCount} | Диаметр: {telescope.aperture_cm} см
          </Card.Text>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button
            variant="light"
            size="sm"
            onClick={handleLike}
            disabled={isLiking || !isAuthenticated}
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              color: buttonColor,
              backgroundColor: buttonBgColor,
              borderColor: buttonBorderColor,
              cursor: !isAuthenticated ? 'not-allowed' : 'pointer'
            }}
            title={!isAuthenticated ? "Войдите, чтобы ставить лайки" : ""}
          >
            {isLiking ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <>
                <HeartFill className="me-1" style={{ marginBottom: '2px' }} />
                {isLiked ? 'Убрать лайк' : 'Поставить лайк'}
              </>
            )}
          </Button>

          {isAuthor && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
               {isDeleting ? <Spinner size="sm" animation="border" /> : 'Удалить'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
