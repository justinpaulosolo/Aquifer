import * as Yup from 'yup';

const RegisterValidation = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email.').required('Email is required.'),
    password: Yup.string()
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            'Password must contain at least 8 characters, one uppercase, one number and one special case character'
        )
        .required('Password is required.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
        .required('Password is required match.'),
});

export default RegisterValidation;
