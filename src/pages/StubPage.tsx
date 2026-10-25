import type { FC } from 'react';
import { Container } from 'react-bootstrap';

export const StubPage: FC = () => {
  return (
    <Container className="text-center pt-5">
      <h3>В разработке</h3>
      <p>Эта страница появится в следующих лабораторных работах.</p>
    </Container>
  );
};
