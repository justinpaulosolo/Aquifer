const newsSect = {
    id: 'newsletter',
    isLightBg: false,
    isLightText: false,
    topLine: 'Latest News',
    headline: 'Subscribe To Our Newsletter!',
    description:
        "By subscribing, you'll receive the latest news about our technology, products, services, career opportunities, and much more!",
    buttonLabel: 'Subscribe',
    isImgStart: false,
    img: require('../../assets/images/cnmPro/newsletterSub.svg').default,
    alt: 'Image of a woman holding a newsletter',
    isPrimary: false,
    isDarkText: true,
    isForm: true,
};

const forclients = {
    id: 'forclients',
    isLightBg: false,
    isLightText: false,
    topLine: 'For clients',
    headline: 'Find talent your way',
    description:
        'Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.',
    isImgStart: false,
    img: require('../../assets/images/small/small-4.jpg').default,
    alt: 'Image of a woman holding a newsletter',
    isPrimary: true,
    isDarkText: true,
    isForm: false,
};

const fortalents = {
    id: 'fortalents',
    isLightBg: true,
    isLightText: false,
    topLine: 'For talents',
    headline: 'Find great work',
    description: 'Meet clients you’re excited to work with and take your career or business to new heights.',
    isImgStart: true,
    img: require('../../assets/images/small/small-1.jpg').default,
    alt: 'Image of a woman holding a newsletter',
    isPrimary: true,
    isDarkText: true,
    isForm: false,
};
export { newsSect, forclients, fortalents };
