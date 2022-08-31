import React, { useState, useEffect } from 'react';
import { Row, Button, Card } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './externallinks.css';
import lookUpService from '../../services/lookUpService';
import externalLinkService from '../../services/externalLinkService';
import { onGlobalError, onGlobalSuccess } from '../../services/serviceHelpers';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import debug from 'debug';
import ExternalLinksValidation from '../../schema/user/externalLinks';

const _logger = debug.extend('ExternalLinks');

const ExternalLinks = (props) => {
    const [userData, setUserData] = useState({
        userData: {
            facebook: '',
            instagram: '',
            linkedIn: '',
            twitter: '',
            otherSocial: '',
            otherWebsite: '',
        },
        urlData: {
            facebook: { id: 0, url: '', urlTypeId: 1 },
            instagram: { id: 0, url: '', urlTypeId: 2 },
            linkedIn: { id: 0, url: '', urlTypeId: 3 },
            twitter: { id: 0, url: '', urlTypeId: 4 },
            otherSocial: { id: 0, url: '', urlTypeId: 5 },
            otherWebsite: { id: 0, url: '', urlTypeId: 6 },
        },
        entityTypeId: 0,
    });
    const [formData, setFormData] = useState({ data: { typesArray: [], componentArray: [] } });

    useEffect(() => {
        lookUpService.LookUp(['UrlTypes']).then(onLookUpSuccess).catch(onGlobalError);
    }, []);

    useEffect(() => {
        externalLinkService.getByCreatedBy().then(onGetExLinkSuccess).catch(onGlobalError);
    }, []);

    const toCamelCase = (text) => {
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim, index) =>
                index === 0 ? leftTrim.toLowerCase() : leftTrim.toUpperCase()
            )
            .replace(/\s+/g, '');
    };

    const mapFormData = (fieldObj) => {
        let { name, id } = fieldObj;
        const newType = toCamelCase(name);
        newType.replace(/\s/g, '');

        return (
            <div className="form-group inputs-exl" key={id} id={id}>
                <label htmlFor={newType}>{name.toUpperCase()}</label>
                <Field type="text" name={newType} className="form-control input-exl" id={id} />
                <ErrorMessage name={newType} component="div" className="has-error">
                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
            </div>
        );
    };

    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        setUserData((prevState) => {
            const newUserData = { ...prevState };
            newUserData.urlData[name].url = value;
            newUserData.userData[name] = value;
            return newUserData;
        });
    };

    const onLookUpSuccess = (response) => {
        if (response?.item?.urlTypes) {
            const typeData = response.item.urlTypes;

            setFormData((prevState) => {
                const newData = { ...prevState };
                newData.data.typesArray = typeData;
                newData.data.componentArray = typeData.map(mapFormData);
                return newData;
            }, []);
        }
    };

    const onGetExLinkSuccess = (response) => {
        if (response?.items) {
            setUserData((prevState) => {
                const newData = { ...prevState };
                const responseArr = response.items;
                const newUserData = newData;

                for (let i = 0; i < responseArr.length; i++) {
                    const current = responseArr[i];
                    const { id, url } = current;
                    const { name } = current.urlTypes;

                    const userLinks = { id, name, url };

                    switch (userLinks.name) {
                        case 'facebook':
                            newUserData.userData.facebook = userLinks.url;
                            newUserData.urlData.facebook.url = userLinks.url;
                            newUserData.urlData.facebook.id = userLinks.id;
                            break;
                        case 'instagram':
                            newUserData.userData.instagram = userLinks.url;
                            newUserData.urlData.instagram.url = userLinks.url;
                            newUserData.urlData.instagram.id = userLinks.id;
                            break;
                        case 'linkedIn':
                            newUserData.userData.linkedIn = userLinks.url;
                            newUserData.urlData.linkedIn.url = userLinks.url;
                            newUserData.urlData.linkedIn.id = userLinks.id;
                            break;
                        case 'twitter':
                            newUserData.userData.twitter = userLinks.url;
                            newUserData.urlData.twitter.url = userLinks.url;
                            newUserData.urlData.twitter.id = userLinks.id;
                            break;
                        case 'other social':
                            newUserData.userData.otherSocial = userLinks.url;
                            newUserData.urlData.otherSocial.url = userLinks.url;
                            newUserData.urlData.otherSocial.id = userLinks.id;
                            break;
                        case 'other website':
                            newUserData.userData.otherWebsite = userLinks.url;
                            newUserData.urlData.otherWebsite.url = userLinks.url;
                            newUserData.urlData.otherWebsite.id = userLinks.id;
                            break;
                        default:
                            _logger('URL Not Found');
                    }
                }

                newData.userData = newUserData.userData;
                newData.urlData = newUserData.urlData;
                newData.entityTypeId = responseArr[0].entityTypes.id;

                return newData;
            }, []);
        }
    };

    const onUpdateSuccess = () => {
        swal({
            buttons: {
                cancel: 'Close',
                onClick: setTimeout(() => {
                    props.toggleModal();
                }, 1000),
            },
            content: (
                <div className="text-center m-auto">
                    <h4 className="text-dark-50 text-center mt-4 fw-bold">Links Successfully Updated</h4>
                    <p className="text-center"></p>
                </div>
            ),
            icon: 'success',
        });
    };
    const handleSubmit = () => {
        setUserData((prevState) => {
            const sendData = { ...prevState };
            const newUrlData = sendData.urlData;

            for (const link in newUrlData) {
                const url = newUrlData[link];
                const linkId = newUrlData[link].id;

                if (linkId > 0) {
                    if (url.url !== '') {
                        delete url.urlTypeId;
                        externalLinkService.updateLink(url).then(onUpdateSuccess).catch(onGlobalError);
                    } else {
                        externalLinkService.deleteById(linkId).then(onGlobalSuccess).catch(onGlobalError);
                    }
                } else if (url.url !== '') {
                    delete url.id;
                    url.entityTypeId = sendData.entityTypeId ? sendData.entityTypeId : 2;
                    externalLinkService.addLink(url).then(onGlobalSuccess).catch(onGlobalError);
                } else {
                    continue;
                }
            }
            return sendData;
        }, []);
    };

    return (
        <>
            <div className="container">
                <div className="row" style={{ justifyContent: 'center', textAlign: 'left' }}>
                    <div className="col-8">
                        <Card className="card-exl" style={{ margin: 'auto' }}>
                            <Card.Title style={{ textAlign: 'center' }}>
                                <h1>
                                    <strong>External Links</strong>
                                </h1>
                            </Card.Title>
                            <Card.Body className="body-externallinks ">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={userData.userData}
                                    validationSchema={ExternalLinksValidation}
                                    onSubmit={handleSubmit}
                                    disabled={!(Formik.isValid && Formik.dirty)}>
                                    <Form onChange={handleChange}>
                                        {formData.data.componentArray}
                                        <Row>
                                            <div className="text-center">
                                                <Button type="submit" className="button-exl">
                                                    Save
                                                </Button>
                                            </div>
                                        </Row>
                                    </Form>
                                </Formik>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};
ExternalLinks.propTypes = { toggleModal: PropTypes.func };
export default ExternalLinks;
