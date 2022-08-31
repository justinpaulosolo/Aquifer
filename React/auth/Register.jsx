import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import AccountLayout from './AccountLayout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import UserService from '../../services/userService';
import RegisterValidation from '../../schema/user/register';
import SiteRefModal from '../../components/references/SiteRefModal';
import toastr from 'toastr';
import swal from '@sweetalert/with-react';

const Register = () => {
    let navigate = useNavigate();
    const redirectUser = () => navigate('/login');
    const [formData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [createdUserId, setCreatedUserId] = useState({ userId: 0, email: ' ' });

    const toggleModal = () => setShowModal(!showModal);

    const handleSubmit = (values) => {
        UserService.add(values).then(onSubmitSuccess).catch(onSubmitError);
    };
    const onSubmitSuccess = (response) => {
        if (response?.response?.data?.item !== null && response.response.data.item > 0) {
            setCreatedUserId((prevState) => {
                const newUserId = { ...prevState };
                newUserId.userId = response.response.data.item;
                newUserId.email = response.email;
                return newUserId;
            });
            toggleModal();
        } else {
            toastr.error('User Not Registered. Please Try Again.');
        }
    };

    const onSubmitError = () => {
        swal({
            buttons: {
                cancel: 'Close',
            },
            title: 'Registration failed',
            icon: 'error',
        });
    };

    const BottomLink = () => {
        return (
            <Row className="mt-3">
                <Col className="text-center">
                    <p className="text-muted">
                        Already have account?
                        <Link to={'/login'} className="text-muted ms-1">
                            <b>Log In</b>
                        </Link>
                    </p>
                </Col>
            </Row>
        );
    };

    return (
        <>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h2 className="text-dark-50 text-center mt-0 fw-bold">Register</h2>
                    <p className="text-muted mb-4">Complete the fields below to register.</p>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={formData}
                    validationSchema={RegisterValidation}
                    onSubmit={handleSubmit}>
                    <Form>
                        <div className="form-group m-2">
                            <label htmlFor="email">Email</label>
                            <Field type="text" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="has-error">
                                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="form-group m-2">
                            <label htmlFor="password">Password</label>
                            <Field type="password" name="password" className="form-control" autoComplete="on" />
                            <ErrorMessage name="password" component="div" className="has-error">
                                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="form-group m-2">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field type="password" name="confirmPassword" className="form-control" autoComplete="on" />
                            <ErrorMessage name="confirmPassword" component="div" className="has-error">
                                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <Row className="justify-content-center">
                            <div className="text-center">
                                <Button type="submit" className="btn btn-primary mx-2 mt-2">
                                    Register
                                </Button>
                            </div>
                            <div className="site-reference-modal">
                                {showModal && (
                                    <SiteRefModal
                                        isShowModal={showModal}
                                        createdUserId={createdUserId}
                                        toggleModal={toggleModal}
                                        redirectUser={redirectUser}
                                    />
                                )}
                            </div>
                        </Row>
                    </Form>
                </Formik>
            </AccountLayout>
        </>
    );
};

export default Register;
