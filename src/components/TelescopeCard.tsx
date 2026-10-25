// src/components/TelescopeCard.tsx
import type { FC } from 'react';
import { Card } from 'react-bootstrap';
import type { Telescope } from '../modules/mockTelescopes';
// Импортируем дефолтную картинку. Убедитесь, что файл лежит в src/assets
import defaultImage from '../assets/default-image.jpg';

interface Props {
  telescope: Telescope;
}

export const TelescopeCard: FC<Props> = ({ telescope }) => {
  // Если в мок-данных пусто, используем локальную картинку
  const imageSrc = telescope.imageUrl ? telescope.imageUrl : defaultImage;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imageSrc}
        style={{ height: '120px', objectFit: 'cover' }}
      />
      <Card.Body className="p-2">
        <Card.Title style={{ fontSize: '14px', marginBottom: '5px' }}>{telescope.name}</Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: '12px' }}>
          ❤ {telescope.likes} | Диаметр: {telescope.aperture_cm} см
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

<Card className="telescope-card">
   {/* ... */}
</Card>
