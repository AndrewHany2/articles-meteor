import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import ArticleItem from '../components/ArticleItem';
import LoadingSpinner from '../components/LoadingSpinner';
import swal from 'sweetalert';

/* Renders a table containing all of the Article documents. Use <ArticleItem> to render each row. */
const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    Meteor.call('getMyArticles', {} , (err, data)=> {
      if(err){
        swal('Error', err.message, 'error')
      }
      setArticles(data);
      setReady(true);
    });
  },[]);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>My Article</h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>createdOn</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => <ArticleItem key={article._id} article={article} showEdit={true}/>)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default MyArticles;
