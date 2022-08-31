import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropTypes, { element, oneOfType } from 'prop-types';

const AccountLayout = ({ bottomLinks, children }) => {
    useEffect(() => {
        if (document.body) document.body.classList.add('authentication-bg');

        return () => {
            if (document.body) document.body.classList.remove('authentication-bg');
        };
    }, []);

    return (
        <>
            <div className="account-pages pb-4 pb-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} xxl={4}>
                            <Card className="shadow-none">
                                <Card.Body className="p-4 shadow rounded-lg">{children}</Card.Body>
                            </Card>
                            {bottomLinks}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

AccountLayout.propTypes = {
    bottomLinks: element,
    children: oneOfType([PropTypes.arrayOf(element), PropTypes.element]),
};

export default AccountLayout;
