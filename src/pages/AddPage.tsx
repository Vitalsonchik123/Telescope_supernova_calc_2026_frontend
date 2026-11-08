import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { TelescopesService } from '../api/generated';

export const AddPage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aperture, setAperture] = useState('');
  const [fov, setFov] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [draftId, setDraftId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Оставляем состояние ошибки только для ошибок сервера
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    name: false,
    aperture: false,
    image: false,
    video: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      TelescopesService.getDraft()
        .then((res) => {
          const draft = res.data ? res.data : res;
          if (draft && draft.id) {
            setDraftId(draft.id);
            setName(draft.name || '');
            setDescription(draft.description || '');
            setAperture(draft.aperture_cm || '');
            setFov(draft.fov_deg || '');
          }
        })
        .catch((err) => console.log('Черновик не найден', err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreview, videoPreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setTouched(prev => ({ ...prev, image: true }));
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
      setTouched(prev => ({ ...prev, video: true }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center pt-5">
        <Card className="p-4 text-center shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#ffffff' }}>
          <h4 className="mb-3" style={{ color: '#174B9B', fontWeight: 'bold' }}>Доступ ограничен</h4>
          <p className="text-muted mb-4">Только зарегистрированные пользователи могут добавлять телескопы.</p>
          <Button onClick={() => navigate('/login')} style={{ backgroundColor: '#174B9B', borderColor: '#174B9B', borderRadius: '20px', padding: '8px 24px' }}>
            Войти в систему
          </Button>
        </Card>
      </Container>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Отмечаем обязательные поля как "тронутые"
    setTouched({ name: true, aperture: true, image: true, video: true });

    // Проверяем ТОЛЬКО обязательные поля (убрали description и fov)
    if (!name || !aperture || !imageFile || !videoFile) {
      // Убрали setError, теперь просто не даем отправить форму
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const draftResponse = await TelescopesService.postTelescopes(name, imageFile, videoFile);
      const currentDraftId = draftResponse.id || draftResponse.data?.id || draftId;
      if (!currentDraftId) throw new Error('Не удалось получить ID черновика');

      // Отправляем пустые строки, если description/fov не заполнены
      await TelescopesService.putTelescopesPublish(currentDraftId, {
        description: description,
        aperture_cm: Number(aperture),
        fov_deg: fov ? Number(fov) : 0, // Если пусто, отправляем 0
      });

      navigate('/grid');
    } catch (err: any) {
      console.error(err);
      setError('Ошибка при публикации. Проверьте соединение с сервером.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="pt-3" style={{ paddingBottom: '160px' }}>
      <Card className="p-3 shadow-sm border-0">
        <h4 className="text-center mb-4" style={{ color: '#174B9B' }}>Добавление телескопа</h4>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>

          {/* Изображение */}
          <Form.Group className="mb-3">
            <Form.Label>Изображение</Form.Label>
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
            <div
              onClick={() => imageInputRef.current?.click()}
              style={{
                border: `2px dashed ${touched.image && !imageFile ? '#dc3545' : '#174B9B'}`,
                borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                backgroundColor: '#f8f9fa', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Превью" style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '4px' }} />
              ) : (
                <span className="text-muted">Нажмите, чтобы выбрать изображение</span>
              )}
            </div>
            {touched.image && !imageFile && <Form.Text className="text-danger">Изображение обязательно</Form.Text>}
          </Form.Group>

          {/* Видео */}
          <Form.Group className="mb-3">
            <Form.Label>Видео</Form.Label>
            <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} style={{ display: 'none' }} />
            <div
              onClick={() => videoInputRef.current?.click()}
              style={{
                border: `2px dashed ${touched.video && !videoFile ? '#dc3545' : '#ced4da'}`,
                borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer',
                backgroundColor: '#f8f9fa', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}
            >
              {videoPreview ? (
                <video src={videoPreview} controls style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '4px' }} />
              ) : (
                <span className="text-muted">Нажмите, чтобы выбрать видео</span>
              )}
            </div>
            {touched.video && !videoFile && <Form.Text className="text-danger">Видео обязательно</Form.Text>}
          </Form.Group>

          {/* Название (обязательно) */}
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: TESS"
              isInvalid={touched.name && !name}
            />
            <Form.Control.Feedback type="invalid">Введите название</Form.Control.Feedback>
          </Form.Group>

          {/* Описание (необязательно) */}
          <Form.Group className="mb-3">
            <Form.Label>Краткое описание (опционально)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Космический телескоп..."
            />
          </Form.Group>

          {/* Диаметр (обязательно) */}
          <Form.Group className="mb-3">
            <Form.Label>Диаметр (см)</Form.Label>
            <Form.Control
              type="number"
              value={aperture}
              onChange={(e) => setAperture(e.target.value)}
              placeholder="10"
              isInvalid={touched.aperture && !aperture}
            />
            <Form.Control.Feedback type="invalid">Введите диаметр</Form.Control.Feedback>
          </Form.Group>

          {/* Поле зрения (необязательно) */}
          <Form.Group className="mb-4">
            <Form.Label>Поле зрения (°) (опционально)</Form.Label>
            <Form.Control
              type="number"
              step="any"
              value={fov}
              onChange={(e) => setFov(e.target.value)}
              placeholder="24"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
            style={{ backgroundColor: '#174B9B', borderColor: '#174B9B', borderRadius: '20px' }}
          >
            {isLoading ? <Spinner size="sm" animation="border" /> : 'Опубликовать'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};
