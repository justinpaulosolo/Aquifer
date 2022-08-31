// @flow
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-light py-5 footer" id="footer">
            <Container>
                <Row>
                    <Col lg={6}>
                        <h1>Aquifer PE</h1>
                    </Col>
                    <Col lg={2} className="mt-3 mt-lg-0">
                        <h5 className="text-light">Company</h5>

                        <ul className="list-unstyled ps-0 mb-0 mt-3">
                            <li className="mt-2">
                                <a href="/about" className="text-muted">
                                    About Us
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Work with us
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Team Members
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/faq" className="text-muted">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={2} className="mt-3 mt-lg-0">
                        <h5 className="text-light">Apps</h5>

                        <ul className="list-unstyled ps-0 mb-0 mt-3">
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Email
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Social Feed
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Projects
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Professional Hooks
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={2} className="mt-3 mt-lg-0">
                        <h5 className="text-light">Discover</h5>
                        <ul className="list-unstyled ps-0 mb-0 mt-3">
                            <li className="mt-2">
                                <a href="/contact" className="text-muted">
                                    Contact
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/landing" className="text-muted">
                                    Our Service
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/privacypolicy" className="text-muted">
                                    Privacy
                                </a>
                            </li>
                            <li className="mt-2">
                                <a href="/cookies" className="text-muted">
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="mt-5">
                            <p className="text-muted mt-4 text-center mb-0">© 2022 Aquifer PE. Licensed Engineers</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
