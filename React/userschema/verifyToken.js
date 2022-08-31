import * as Yup from 'yup';

const TokenVerification = Yup.object().shape({
    one: Yup.number().required(),
    two: Yup.number().required(),
    three: Yup.number().required(),
    four: Yup.number().required(),
    five: Yup.number().required(),
    six: Yup.number().required(),
});

export default TokenVerification;
