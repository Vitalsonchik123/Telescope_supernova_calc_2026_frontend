import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setMinAperture } from '../store/slices/filtersSlice';
import { TelescopeCard } from '../components/TelescopeCard';
import { Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { TelescopesService } from '../api/generated'; // Импорт сгенерированного клиента

export const GridPage = () => {
  const dispatch = useDispatch();
  // значение из Redux
  const appliedValue = useSelector((state: RootState) => state.filters.minAperture);

  const [telescopes, setTelescopes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTelescopes();
  }, [appliedValue]);

  const fetchTelescopes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TelescopesService.getTelescopes(appliedValue);
      setTelescopes(data || []);
    } catch (err: any) {
      setError('Ошибка при загрузке данных. Проверьте бэкенд.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (sliderRef.current) {
      dispatch(setMinAperture(Number(sliderRef.current.value)));
    }
  };

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
            ref={sliderRef}
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

        <button className="filter-btn" onClick={handleApply} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Применить'}
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={2} md={2} className="g-2 mt-2">
        {telescopes.map((telescope) => (
          <Col key={telescope.id}>
            <TelescopeCard telescope={telescope} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
