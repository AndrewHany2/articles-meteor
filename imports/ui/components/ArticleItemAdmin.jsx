import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Article (Admin) table. See pages/ListArticleAdmin.jsx. */
const ArticleItemAdmin = ({ article }) => (
  <tr>
    <td>{article.name}</td>
    <td>{article.quantity}</td>
    <td>{article.condition}</td>
    <td>{article.owner}</td>
  </tr>
);

// Require a document to be passed to this component.
ArticleItemAdmin.propTypes = {
  article: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

export default ArticleItemAdmin;
