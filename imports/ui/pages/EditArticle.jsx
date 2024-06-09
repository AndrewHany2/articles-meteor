import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { Formik, useFormik } from 'formik';
import TextField from '../components/TextInput';
import * as Yup from 'yup';
import { Card, Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';


/* Renders the EditArticle page for editing a single document. */
const EditArticle = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const [loading, setLoading] = useState(false);
  const { _id: id } = useParams();
  const [initialValues, setInitialValues] = useState({ title: '', description: '' });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchArticleDetails = () => {
    return new Promise((resolve, reject) => {
      Meteor.call('getArticleDetails', id, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

const { isPending, error, data } = useQuery({
  queryKey: ['fetchArticle', {id}],
  queryFn: () => fetchArticleDetails(),
});

  const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
    });
  
  const submit = (values) => {
    setLoading(true);
    Meteor.call('editArticle', { ...values, id }, (err, data) => {
      if(err){
        swal('Error', err.reason, 'error');
      } else {
        swal('Success', 'Item updated successfully', 'success');
        setInitialValues({ title: values.title, description: values.description });
      }
    });
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: submit,
    enableReinitialize: true,
  });
  const { errors, touched, handleSubmit, handleChange, values, setFieldValue } = formik;
  
  useEffect(()=>{
    if(data) setInitialValues({ title:data.title, description: data.description});
  },[data]);

  if(isPending) return <LoadingSpinner></LoadingSpinner>

  if(error) swal('Error', error.message, 'error');

  
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Edit Article</h2></Col>
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
              {loading ? <LoadingSpinner></LoadingSpinner> : <Button type="submit" disabled={loading || _.isEqual(values, initialValues)}>
                  Submit
              </Button>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditArticle;
