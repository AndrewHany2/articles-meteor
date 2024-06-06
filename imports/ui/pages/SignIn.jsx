import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import TextField from '../components/TextInput';
import * as Yup from 'yup';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const initialValues = { email: '', password: '' };
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('No password provided.') 
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
});

const SignIn = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    setLoading(true);
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.log(err);
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    setLoading(false);
  };

  // Render the signin form.
  // console.log('render', error, redirect);
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return (<Navigate to="/" />);
  }
  // Otherwise return the Login form.
  return (
    <Container id="signin-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Login to your account</h2>
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
                  />
              </div>
              <div className='mb-3'>
                  <div style={{color:"red"}}>
                      {error}
                  </div>
              </div>
              {loading ? <LoadingSpinner></LoadingSpinner> : <Button type="submit" disabled={loading}>
                    Submit
                </Button>}
            </Form>)}
          </Formik>
          <Alert variant="light">
            <Link to="/signup">Click here to Register</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
