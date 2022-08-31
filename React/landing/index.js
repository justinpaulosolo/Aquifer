// @flow
import React, { useEffect } from 'react';

// components
import Layout from './NewsLetter';
import HeaderVideo from './headervideo/HeaderVideo';

// dummy data
import { newsSect, forclients, fortalents } from './LandingData';

const Landing = () => {
    useEffect(() => {
        if (document.body) document.body.classList.remove('authentication-bg');
    }, []);

    return (
        <>
            <HeaderVideo />
            <Layout {...forclients} />
            <Layout {...fortalents} />
            <Layout {...newsSect} />
        </>
    );
};

export default Landing;
