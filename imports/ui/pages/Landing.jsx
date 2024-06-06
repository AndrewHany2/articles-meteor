import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import ListArticle from './ListArticle';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id="landing-page" fluid className="py-3">
    <ListArticle></ListArticle>
  </Container>
);

export default Landing;
