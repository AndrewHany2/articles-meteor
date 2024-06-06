import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Card, Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import TextField from '../components/TextInput';
import { Formik } from 'formik';
import * as Yup from 'yup';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */

const initialValues = { name:'', email: '', password: '' };
const schema = Yup.object().shape({
    name: Yup.string().required().min(5).max(20),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('No password provided.') 
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
  });

const SignUp = ({ location }) => {
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password, name } = doc;
    Accounts.createUser({ email, username: email, password, profile: name }, (err) => {
      setLoading(true);
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
      setLoading(false);
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location?.state || { from: { pathname: '/' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }
  return (
    <Container id="signup-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Register your account</h2>
          </Col>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={submit}
          >
          {({  
            errors,
            values,
            touched,
            handleSubmit,
            handleChange
         }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <div>
                    <div>
                      <TextField
                          label="Name"
                          name="name"
                          type="text"
                          placeholder="Enter your name"
                          onChange={handleChange}
                          value={values.name}
                          className="mb-3"
                          required
                          error={errors.name}
                          disabled={loading}
                      />
                    </div>
                    <div>
                      <TextField
                          label="Email"
                          name="email"
                          type="text"
                          placeholder="Enter your email"
                          onChange={handleChange}
                          value={values.email}
                          className="mb-3"
                          required
                          error={errors.email}
                          disabled={loading}

                      />
                    </div>
                    <div>
                      <TextField
                          label="Password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          onChange={handleChange}
                          value={values.password}
                          className="mb-3"
                          required
                          error={errors.password}
                          disabled={loading}
                      />
                    </div>
                    <div className='mb-3'>
                        <div style={{color:"red"}}>
                            {error}
                        </div>
                    </div>
                </div>
                {loading ? <LoadingSpinner></LoadingSpinner> : <Button type="submit" disabled={loading}>
                    Submit
                </Button>}
            </Form>
          )}
          </Formik>
          <Alert variant="light">
            Already have an account? Login
            {' '}
            <Link to="/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
SignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

SignUp.defaultProps = {
  location: { state: '' },
};

export default SignUp;
