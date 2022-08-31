// @flow
import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logger from 'debug';
import PropTypes from 'prop-types';
import UserService from '../../services/userService';

const _logger = Logger.extend('Navbar');

const NavBar = (props) => {
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        UserService.logout().then(onLogOutSuccess).catch(onLogOutError);
    };

    const onLogOutSuccess = () => {
        const state = {
            type: 'LOGOUT_SUCCESS',
            payload: true,
        };
        navigate('/', { state });
    };

    const onLogOutError = (error) => {
        _logger(error, 'Logout unsuccessful');
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" variant="light" className="py-lg-3">
                <Container>
                    <Navbar.Brand href="/" className="me-lg-5">
                        <h1>Aquifer PE</h1>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav">
                        <i className="mdi mdi-menu"></i>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav as="ul" className="me-auto align-items-center">
                            <Nav.Item as="li" className="mx-lg-1">
                                <Nav.Link href="/">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/jobs">Jobs</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/Blog">Blog</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/listsharestory">Stories</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/faq">FAQ</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/about">About</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mx-lg-1">
                                <Nav.Link href="/contact">Contact</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        {props.user?.roles.includes('Admin') && (
                            <>
                                <Link to="/dashboard" className="btn btn-primary btn-sm">
                                    Dashboard
                                </Link>
                                <div className="m-1"></div>
                            </>
                        )}
                        {props.user?.roles.includes('Org Admin') && (
                            <>
                                <Link to="/admin/organization/dashboard" className="btn btn-primary btn-sm">
                                    Dashboard
                                </Link>
                                <div className="m-1"></div>
                            </>
                        )}
                        {!props.user?.isLoggedIn && (
                            <>
                                <Link to="/login" className="btn btn-light btn-sm">
                                    Login
                                </Link>
                                <div className="m-1"></div>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Register
                                </Link>
                            </>
                        )}
                        {props.user?.isLoggedIn && (
                            <>
                                <Link to="/" onClick={handleLogout} className="btn btn-primary btn-sm">
                                    Log out
                                </Link>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

NavBar.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
    }),
};

export default NavBar;
