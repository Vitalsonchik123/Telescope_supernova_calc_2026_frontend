import { useState } from 'react';
import type { FC } from 'react';
import { mockTelescopes } from '../modules/mockTelescopes';
import { TelescopeCard } from '../components/TelescopeCard';
import { Form, Row, Col, Container } from 'react-bootstrap';

export const GridPage: FC = () => {
  // Хук состояния для значения фильтра
  const [minAperture, setMinAperture] = useState<number>(0);

  // Фильтруем массив на основе значения ползунка
  const filteredTelescopes = mockTelescopes.filter(
    (t) => t.aperture_cm >= minAperture
  );

  return (
    <Container className="pb-5 pt-3">
      <h4 className="mb-3">Плитка</h4>

      <Form.Group className="mb-4 p-3 bg-light rounded shadow-sm">
        <Form.Label>Минимальный диаметр: <b>{minAperture} см</b></Form.Label>
        <Form.Range
          min={0}
          max={1000}
          step={10}
          value={minAperture}
          onChange={(e) => setMinAperture(Number(e.target.value))}
        />
      </Form.Group>

      <Row xs={2} md={2} className="g-2">
        {filteredTelescopes.map((telescope) => (
          <Col key={telescope.id}>
            <TelescopeCard telescope={telescope} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
