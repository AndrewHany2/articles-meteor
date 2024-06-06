import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Article table. See pages/ListArticle.jsx. */
const ArticleItem = ({ article, showEdit }) => (
  <tr>
    <td><Link to={`/articles/${article._id}`}>{article.title}</Link></td>
    <td>{article.description}</td>
    <td>{article.createdOn.toLocaleString()}</td>
    {showEdit && <td>
      <Link to={`/articles/edit/${article._id}`} state={JSON.stringify(article)}>Edit</Link>
    </td>}
  </tr>
);

// Require a document to be passed to this component.
ArticleItem.propTypes = {
  article: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ArticleItem;
