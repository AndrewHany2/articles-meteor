import React, { useState } from 'react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Articles } from '../../api/article/article';
import LoadingSpinner from '../components/LoadingSpinner';
import { Formik } from 'formik';
import TextField from '../components/TextInput';
import { useLocation } from "react-router-dom";
import * as Yup from 'yup';
import { Card, Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';


/* Renders the EditArticle page for editing a single document. */
const EditArticle = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { _id } = useParams();
  const location = useLocation();
  const state = JSON.parse(location.state);
  const [initialValues, setInitialValues] = useState({title: state.title , description: state.description});

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Article documents.
    const subscription = Meteor.subscribe(Articles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Articles.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // On successful submit, insert the data.
  const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
    });
  
  const submit = (values) => {
    setLoading(true);
    Meteor.call('editArticle', { ...values, _id }, (err, data) => {
      if(err){
        swal('Error', err.reason, 'error');
      } else {
        swal('Success', 'Item updated successfully', 'success');
        setInitialValues({ title: values.title, description: values.description });
      }
    });
    setLoading(false);
  };

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Edit Article</h2></Col>
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
              {loading ? <LoadingSpinner></LoadingSpinner> : <Button type="submit" disabled={loading || _.isEqual(values, initialValues)}>
                  Submit
              </Button>}
          </Form>
        )}
         </Formik>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditArticle;
