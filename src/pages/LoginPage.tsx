import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner, Card } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosInstance';
import { setCredentials } from '../store/slices/authSlice';

export const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/users/login', { name, password });

      const { token, user } = response.data;

      localStorage.setItem('token', token);

      dispatch(setCredentials({ user }));

      navigate('/');
    } catch (err: any) {
      console.error("Ошибка при входе:", err.response?.data || err.message);

      const errorMessage = err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow-sm border-0">
        <h2 className="text-center mb-4" style={{ color: '#174B9B', fontWeight: 'bold' }}>Вход в систему</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
            style={{ backgroundColor: '#174B9B', borderColor: '#174B9B' }}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};
