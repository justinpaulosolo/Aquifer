import React, { useState } from 'react';
import Video from './video.mp4';
import {
    HeroContainer,
    HeroBG,
    VideoBG,
    VideoTextContent,
    VideoP,
    VideoBtnWrapper,
    ArrowForward,
    ArrowRight,
    Button,
} from './videoBackgroundStyledComponents';

const HeaderVideo = () => {
    const [hover, setHover] = useState(false);

    const onHover = () => {
        setHover(!hover);
    };
    return (
        <HeroContainer>
            <HeroBG>
                <VideoBG autoPlay loop="loop" muted>
                    <source src={Video} type="video/mp4"></source>
                </VideoBG>
            </HeroBG>
            <VideoTextContent>
                <VideoP>
                    Engineers
                    <br />
                    Freelancers
                    <br />
                    Engineering Firms
                </VideoP>
                <VideoBtnWrapper>
                    <Button to="/register" onMouseEnter={onHover} onMouseLeave={onHover}>
                        Join Now {hover ? <ArrowForward /> : <ArrowRight />}
                    </Button>
                </VideoBtnWrapper>
            </VideoTextContent>
        </HeroContainer>
    );
};

export default HeaderVideo;
