import { useState, useRef } from 'react';
import { mockTelescopes } from '../modules/mockTelescopes';
import { TelescopeCard } from '../components/TelescopeCard';
import { Row, Col, Container } from 'react-bootstrap';

export const GridPage = () => {
  const [appliedValue, setAppliedValue] = useState<number>(0);

  const sliderRef = useRef<HTMLInputElement>(null);

  const handleApply = () => {
    if (sliderRef.current) {
      setAppliedValue(Number(sliderRef.current.value));
    }
  };

  const filteredTelescopes = mockTelescopes.filter(
    (t) => t.aperture_cm >= appliedValue
  );

  return (
    <Container className="pt-2" style={{ paddingBottom: '110px' }}>

      <div className="filter-section">
        <div className="filter-header">
          <label className="slider-label">Диаметр от (см):</label>
          <div className="slider-value-box">{appliedValue}</div>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            defaultValue={appliedValue}
            ref={sliderRef} // 5. Привязываем ref
            className="custom-range"
          />
          <div className="slider-scale">
            <span>0</span>
            <span>200</span>
            <span>400</span>
            <span>600</span>
            <span>800</span>
            <span>1000</span>
          </div>
        </div>

        <button className="filter-btn" onClick={handleApply}>
          Применить
        </button>
      </div>

      <Row xs={2} md={2} className="g-2 mt-2">
        {filteredTelescopes.map((telescope) => (
          <Col key={telescope.id}>
            <TelescopeCard telescope={telescope} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
