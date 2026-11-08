import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setSliderPosition, applyFilter } from '../store/slices/filtersSlice';
import { TelescopeCard } from '../components/TelescopeCard';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import { TelescopesService } from '../api/generated';
import { mockTelescopes } from '../modules/mockTelescopes';

export const GridPage = () => {
  const dispatch = useDispatch();

  const appliedValue = useSelector((state: RootState) => state.filters.minAperture);
  const sliderPos = useSelector((state: RootState) => state.filters.sliderPosition);

  const [telescopes, setTelescopes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTelescopes();
  }, [appliedValue]);

  const fetchTelescopes = async () => {
    setIsLoading(true);
    try {
      const response = await TelescopesService.getTelescopes(appliedValue);
      const actualData = Array.isArray(response) ? response : response.data;
      setTelescopes(actualData || []);
    } catch (err: any) {
      // FALLBACK (МОКИ)
      const filteredMocks = mockTelescopes.filter(
        (t) => t.aperture_cm >= appliedValue
      );
      setTelescopes(filteredMocks);
    } finally {
      setIsLoading(false);
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
            value={sliderPos}
            onChange={(e) => dispatch(setSliderPosition(Number(e.target.value)))}
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

        <button className="filter-btn" onClick={() => dispatch(applyFilter())} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Применить'}
        </button>
      </div>

      <Row xs={2} md={2} className="g-2 mt-2">
        {telescopes.map((telescope) => (
          <Col key={telescope.id}>
            <TelescopeCard telescope={telescope} onRefresh={fetchTelescopes} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
