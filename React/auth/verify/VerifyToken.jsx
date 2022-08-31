import React, { useState, useEffect } from 'react';
import AccountLayout from '../AccountLayout';
import { Formik, Form, Field } from 'formik';
import UserService from '../../../services/userService';
import { useLocation, useNavigate } from 'react-router-dom';
import TokenVerification from '../../../schema/user/verifyToken';
import swal from '@sweetalert/with-react';
import Logger from 'debug';

const _logger = Logger.extend('VerifyToken');

export default function Verify() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [formData] = useState({
        one: '',
        two: '',
        three: '',
        four: '',
        five: '',
        six: '',
    });

    const [loginData, setLoginData] = useState({});

    const handleSubmit = (values) => {
        const code = Object.values(values).join().replace(/,/g, '');
        const payload = {
            Email: loginData.Email,
            Password: loginData.Password,
            PhoneNumber: loginData.PhoneNumber,
            Token: code,
        };
        UserService.verifyAuthenticationToken(payload)
            .then(onVerifyAuthenticationTokenSuccess)
            .catch(onVerifyAuthenticationTokenError);
    };

    const onVerifyAuthenticationTokenSuccess = () => {
        UserService.currentV2().then(onGetCurrentSuccess).catch(onGetCurrentError);
    };

    const onVerifyAuthenticationTokenError = () => {
        swal({
            buttons: {
                cancel: 'Try again',
            },
            title: 'Login failed',
            icon: 'error',
        });
    };

    const onGetCurrentSuccess = (response) => {
        _logger(response, 'onGetCurrentSuccess');
        const state = {
            type: 'LOGIN_SUCCESS',
            payload: response.item,
        };

        let userRoles = response.item.roles;

        if (userRoles.includes('Admin')) {
            navigate('/dashboard', { state });
        } else if (userRoles.includes('Org Admin')) {
            navigate('/admin/organization/dashboard', { state });
        } else {
            if (state.payload.hasProfile) {
                navigate('/userprofile', { state });
            } else {
                navigate('/onboarding', { state });
            }
        }
    };

    const onGetCurrentError = (error) => {
        _logger(error);
    };

    useEffect(() => {
        if (state && state.type === 'VERIFY_TOKEN') {
            setLoginData(state.payload.data);
        }
    }, []);

    return (
        <AccountLayout>
            <div className="text-center w-75 m-auto pb-2">
                <h2 className="text-dark-50 text-center mt-0 fw-bold">Two-Factor Authentication</h2>
            </div>
            <h3 className="text-muted mb-4">Code:</h3>
            <Formik
                enableReinitialize={true}
                initialValues={formData}
                onSubmit={handleSubmit}
                validationSchema={TokenVerification}>
                <Form>
                    <div className="d-flex row mb-4 form-group">
                        <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2 form-group">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg p-2"
                                maxLength={1}
                                name="one"
                            />
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg p-2"
                                maxLength={1}
                                name="two"
                            />
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg p-2"
                                maxLength={1}
                                name="three"
                            />
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg p-2"
                                maxLength={1}
                                name="four"
                            />
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg p-2"
                                maxLength={1}
                                name="five"
                            />
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                            <Field
                                type="text"
                                className="form-control form-control-lg text-lg text-center p-2"
                                maxLength={1}
                                name="six"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn bg-primary btn text-white">
                            Continue
                        </button>
                    </div>
                </Form>
            </Formik>
        </AccountLayout>
    );
}
