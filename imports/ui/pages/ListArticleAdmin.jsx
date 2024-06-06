import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Articles } from '../../api/article/article';
import ArticleItemAdmin from '../components/ArticleItemAdmin';
import LoadingSpinner from '../components/LoadingSpinner';

/* Renders a table containing all of the Article documents. Use <ArticleItemAdmin> to render each row. */
const ListArticleAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { articles, ready } = useTracker(() => {
    // Get access to Article documents.
    const subscription = Meteor.subscribe(Articles.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Article documents
    const items = Articles.collection.find({}).fetch();
    return {
      articles: items,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h2>List Article (Admin)</h2></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => <ArticleItemAdmin key={article._id} article={article} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListArticleAdmin;
