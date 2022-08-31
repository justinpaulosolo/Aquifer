import * as Yup from "yup";

const LoginValidation = Yup.object().shape({
  email: Yup
    .string()
    .email('Email must be a valid email.')
    .required('Email is required.'),
  password: Yup
    .string()
    .required('Password is required.'),
})

export default LoginValidation;