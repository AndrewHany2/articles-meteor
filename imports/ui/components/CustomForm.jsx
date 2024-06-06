import { Formik } from 'formik';
import TextField from '../components/TextInput';
import * as Yup from 'yup';

const CustomForm = ({ submit, schema, initialValues, loading, error, children }) => {
    return <div>
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
            {loading ? <LoadingSpinner></LoadingSpinner> : <Button type="submit" disabled={loading}>
                Submit
            </Button>}
        </Form>
    )}
    </Formik>
    {error === '' ? (
    ''
    ) : (
    <Alert variant="danger">
        <Alert.Heading>Registration was not successful</Alert.Heading>
        {error}
    </Alert>
    )}</div>
}
export default CustomForm;