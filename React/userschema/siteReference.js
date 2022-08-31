import * as Yup from 'yup';

const SiteReferenceValidation = Yup.object().shape({
    referenceId: Yup.number().min(1).max(9).required('Is Required'),
});

export default SiteReferenceValidation;
