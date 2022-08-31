import React, { useState } from 'react';
import PropTypes from 'prop-types';
import newsletterService from '../../services/newsletterService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toastr from 'toastr';
import swal from '@sweetalert/with-react';
import logger from 'debug';
import {
    NewsSubscriptionContainer,
    NewsSubscriptionWrapper,
    NewsSubscriptionRow,
    Column1,
    Column2,
    TextWrapper,
    TopLine,
    Heading,
    Subtitle,
    BtnWrap,
    ImgWrap,
    Img,
    NewsSubBtn,
    FormLabel,
} from '../newslettersubscriptions/styledcomponents/subscribeStyledComponents';
import '../newslettersubscriptions/newssubscriptions.css';
import newsletterSchema from '../../schema/newsletterSchema';

const NewsSubMain = ({
    id,
    isLightBg,
    isLightText,
    topLine,
    headline,
    description,
    buttonLabel,
    isImgStart,
    img,
    alt,
    isPrimary,
    isDarkText,
    isForm,
}) => {
    const [formData] = useState({
        email: '',
    });

    const handleSubmit = (values) => {
        newsletterService.addSubscription(values).then(onSubmitSuccess).catch(onSubmitError);
    };

    const _logger = logger.extend('Newsletter');

    const onSubmitSuccess = (values) => {
        _logger('values', values.email);
        toastr.success('Subscribed!');
        newsletterService.sendNewsletterConfirmation(values);
    };

    const onSubmitError = () => {
        swal({
            buttons: {
                cancel: 'Ok',
            },
            title: 'Please enter a valid email!',
            icon: 'error',
        });
    };

    return (
        <NewsSubscriptionContainer isLightBg={isLightBg} id={id} className="newsContainer">
            <NewsSubscriptionWrapper>
                <NewsSubscriptionRow imgStart={isImgStart}>
                    <Column1>
                        <TextWrapper>
                            <TopLine lightText={isLightText}>{topLine}</TopLine>
                            <Heading lightText={isLightText}>{headline}</Heading>
                            <Subtitle darkText={isDarkText}>{description}</Subtitle>
                            {isForm && (
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={formData}
                                    onSubmit={handleSubmit}
                                    validationSchema={newsletterSchema}>
                                    <Form>
                                        <FormLabel htmlFor="email"></FormLabel>
                                        <Field
                                            type="email"
                                            placeholder="Email*"
                                            name="email"
                                            className="news-subscription-form-input"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="newsletter-error-message"
                                        />
                                        <BtnWrap>
                                            <NewsSubBtn
                                                type="submit"
                                                smooth="true"
                                                duration={500}
                                                exact="true"
                                                offset={-80}
                                                primary={isPrimary ? 1 : 0}
                                                dark={isDarkText ? 1 : 0}>
                                                {buttonLabel}
                                            </NewsSubBtn>
                                        </BtnWrap>
                                    </Form>
                                </Formik>
                            )}
                        </TextWrapper>
                    </Column1>
                    <Column2>
                        <ImgWrap>
                            <Img src={img} alt={alt} />
                        </ImgWrap>
                    </Column2>
                </NewsSubscriptionRow>
            </NewsSubscriptionWrapper>
        </NewsSubscriptionContainer>
    );
};

NewsSubMain.propTypes = {
    id: PropTypes.string.isRequired,
    isLightBg: PropTypes.bool.isRequired,
    isLightText: PropTypes.bool.isRequired,
    topLine: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string,
    isImgStart: PropTypes.bool.isRequired,
    img: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    isPrimary: PropTypes.bool.isRequired,
    isDarkText: PropTypes.bool.isRequired,
    isForm: PropTypes.bool,
};

export default NewsSubMain;
