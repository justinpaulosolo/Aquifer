import React, { useEffect, useState } from 'react';
import AccountLayout from '../AccountLayout';
import { Formik, Form, Field } from 'formik';
import Logger from 'debug';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../services/userService';
import SendTokenSchema from '../../../schema/user/sendToken';

const _logger = Logger.extend('Verify Page');

export default function Verify() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        phoneNumber: '',
    });

    useEffect(() => {
        if (state && state.type === 'CREDENTIAL_MATCH') {
            setFormData((prev) => {
                let pd = { ...prev };
                pd.phoneNumber = '';
                pd.email = state.payload.data.email;
                pd.password = state.payload.data.password;
                return pd;
            });
        }
    }, []);

    const handleSubmit = (values) => {
        const payload = {
            PhoneNumber: values.phoneNumber,
        };
        UserService.sendAuthenticationToken(payload)
            .then(onSendAuthenticationTokenSuccess)
            .catch((response) => _logger(response));
    };

    const onSendAuthenticationTokenSuccess = (response) => {
        const phoneNumber = response.phoneNumber.PhoneNumber;
        const data = {
            PhoneNumber: phoneNumber,
            Email: formData.email,
            Password: formData.password,
        };
        const state = {
            type: 'VERIFY_TOKEN',
            payload: { data },
        };
        navigate('/login/verify/auth', { state });
    };

    return (
        <AccountLayout>
            <div className="text-center w-75 m-auto">
                <h2 className="text-dark-50 text-center mt-0 fw-bold">Two-Factor Authentication</h2>
                <p className="text-muted mb-4">
                    Enter your phone number, we will text you a 6-digit security code to verify your phone.
                </p>
            </div>
            <Formik
                enableReinitialize={true}
                initialValues={formData}
                onSubmit={handleSubmit}
                validationSchema={SendTokenSchema}>
                {({ errors, touched }) => (
                    <Form>
                        <div className="form-group m-2">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <Field type="text" name="phoneNumber" className="form-control" placeholder="+12131112222" />
                            {errors.phoneNumber && touched.phoneNumber ? (
                                <div className="text-danger">Phone number must start with +1</div>
                            ) : null}
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </AccountLayout>
    );
}
