import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Articles } from '../../api/article/article';
import ArticleItem from '../components/ArticleItem';
import LoadingSpinner from '../components/LoadingSpinner';
import swal from 'sweetalert';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

/* Renders a table containing all of the Article documents. Use <ArticleItem> to render each row. */
const ListArticle = () => {
  const [limit, setLimit] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchArticles = ({ page, limit, searchQuery }) => {
    return new Promise((resolve, reject) => {
      Meteor.call('getArticles', { page, limit, searchQuery }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['fetchArticles', { page }],
    queryFn: () => fetchArticles({ page, limit, searchQuery }),
  });

  const articles = data?.docs || [];
  const totalCount = data?.totalCount || 1;

  const handlePageClick = (page) => {
    const q = { page };
    if(searchQuery !== '') q.search = searchQuery;
    navigate({ pathname: currentPathname, search: createSearchParams(q).toString() });
    setSearchParams(createSearchParams(q));
  };

  useEffect(() => {
    setPage(parseInt(searchParams.get('page')) || 1);
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  }

  if(isPending) return <LoadingSpinner />

  if(error) swal('Error', error.message, 'error');

  return (<Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>List Article</h2>
          </Col>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search..."
              aria-label="Search..."
              aria-describedby="basic-addon2"
              value={searchQuery}
              onChange={handleChange}
            />
            <InputGroup.Text id="basic-addon2">
              <Button onClick={()=>{
                navigate({ pathname: currentPathname, search: createSearchParams({ page: 1, search: searchQuery }).toString() });
              }}>
                Search
              </Button>
            </InputGroup.Text>
          </InputGroup>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>description</th>
                <th>createdOn</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => <ArticleItem key={article._id} article={article} />)}
            </tbody>
          </Table>
          <PaginationControl
            page={page}
            between={4}
            total={totalCount}
            limit={limit}
            changePage={handlePageClick}
          />
            <div>Total Count: {totalCount}</div>
        </Col>
    </Row>
    </Container>
  );
};

export default ListArticle;
