import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import UserService from '../../services/userService';
import swal from '@sweetalert/with-react';
import AccountLayout from './AccountLayout';
import mailSent from '../../assets/images/mail_sent.svg';

const Confirm = () => {
    const navigate = useNavigate();
    const search = useLocation().search;
    const token = new URLSearchParams(search).get('token');

    useEffect(() => {
        UserService.emailVerification(token).then(emailVerificationSuccess).catch(emailVerificationError);
    }, [token]);

    const emailVerificationSuccess = () => {
        if (token !== null) {
            swal({
                buttons: {
                    cancel: 'Close',
                },
                content: (
                    <div className="text-center m-auto">
                        <h4 className="text-dark-50 text-center mt-4 fw-bold">Acount Confirmed!</h4>
                    </div>
                ),
                icon: 'success',
            }).then(navigate('/login'));
        }
    };

    const emailVerificationError = () => {
        swal({
            button: {
                cancel: 'Close',
            },
            content: (
                <div className="text-center m-auto">
                    <h4 className="text-dark-50 text-center mt-4 fw-bold">An error occurred.</h4>
                </div>
            ),
            icon: 'error',
        });
    };

    return (
        <>
            <AccountLayout>
                <div className="text-center m-auto">
                    <img src={mailSent} alt="mail sent" height="64" />
                    <h4 className="text-dark-50 text-center mt-4 fw-bold">Please check your email</h4>
                    <p className="text-muted mb-4">
                        A email has been send to to your inbox. Please check for an email from Cnmp and click on the
                        included link to confirm your account.
                    </p>
                    <p className="text-center">
                        <Link className="btn btn-primary" to="/login">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </AccountLayout>
        </>
    );
};

export default Confirm;
