import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <Container>
    <Row className="justify-content-md-center">
      <Spinner animation="border" />
        Loading
    </Row>
  </Container>
);

export default LoadingSpinner;
