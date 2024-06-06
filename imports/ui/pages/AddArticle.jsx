import React, { useState } from 'react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { Articles } from '../../api/article/article';
import { Formik } from 'formik';
import { Card, Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import TextField from '../components/TextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router';

// Create a schema to specify the structure of the data to appear in the form.

const initialValues = { title:'', description: '' };
const schema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
  });

/* Renders the AddArticle page for adding a document. */
const AddArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // On submit, insert the data.
  const submit = (data) => {
    const { title, description } = data;
    const createdById = Meteor.user().username;
    setLoading(true);
    Meteor.call('addArticle', { title, description, createdById }, (err, data)=>{
      if(err) swal(err.reason);
      else {
        navigate(`/articles/${data}`);
      }
      setLoading(false);
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add Article</h2></Col>
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
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter Article title"
                  onChange={handleChange}
                  value={values.title}
                  className="mb-3"
                  required
                  error={errors.title}
                  disabled={loading}
              />
            </div>
            <div>
              <TextField
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Enter Article Description"
                  onChange={handleChange}
                  value={values.description}
                  className="mb-3"
                  required
                  error={errors.description}
                  disabled={loading}
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
          </Form>
        )}
         </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default AddArticle;
