import { useState } from 'react';
import { mockTelescopes } from '../modules/mockTelescopes';
import { TelescopeCard } from '../components/TelescopeCard';
import { Form, Row, Col, Container } from 'react-bootstrap';

export const GridPage = () => {
  const [minAperture, setMinAperture] = useState<number>(0);

  const filteredTelescopes = mockTelescopes.filter(
    (t) => t.aperture_cm >= minAperture
  );

  return (
    // paddingBottom, чтобы контент не уходил под меню
    <Container className="pt-3" style={{ paddingBottom: '110px' }}>

      <Form.Group className="mb-4 p-3 bg-light rounded shadow-sm">
        <Form.Label>Минимальный диаметр: <b>{minAperture} см</b></Form.Label>
        <Form.Range
          min={0}
          max={1000}
          step={10}
          value={minAperture}
          onChange={(e) => setMinAperture(Number(e.target.value))}
          style={{ accentColor: '#174B9B' }}
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
