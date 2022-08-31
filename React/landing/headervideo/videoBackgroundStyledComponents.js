import styled from 'styled-components';
import { MdKeyboardArrowRight, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';

export const HeroContainer = styled.div`
    margin: -12px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 400px;
    position: relative;
    z-index: 1;
`;

export const HeroBG = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 400px;
    overflow: hidden;
`;

export const VideoBG = styled.video`
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    background: #232a34;
`;

export const VideoTextContent = styled.div`
    z-index: 3;
    max-width: 1200px;
    position: absolute;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const VideoP = styled.p`
    margin-top: 10px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600px;
    -webkit-animation: fadeIn 6s;
    -moz-animation: fadeIn 6s;
    -o-animation: fadeIn 6s;
    -ms-animation: fadeIn 6s;

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @media screen and (max-width: 768px) {
        font-size: 24px;
    }

    @media screen and (max-width: 480px) {
        font-size: 18px;
    }
`;

export const VideoBtnWrapper = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size: 20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left: 8px;
    font-size: 20px;
`;

export const Button = styled(Link)`
    border-radius: 50px;
    background: ${({ bprimary }) => (bprimary ? '#01bf71' : '#727cf5')};
    white-space: nowrap;
    padding: ${({ large }) => (large ? '14px 48px' : '12px 30px')};
    color: ${({ dark }) => (dark ? '#010606' : '#fff')};
    font-size: ${({ fbig }) => (fbig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;
    -webkit-animation: fadeIn 3s;
    -moz-animation: fadeIn 3s;
    -o-animation: fadeIn 3s;
    -ms-animation: fadeIn 3s;

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    &:hover {
        transition: all 0.2s ease-in-out;
        background: ${({ bprimary }) => (bprimary ? '#010606' : '#fff')};
    }
`;
