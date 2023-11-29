document.addEventListener('scroll', checkVisibleHeader);

function checkVisibleHeader() {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    if (scrollTop < windowHeight) {
        const header = document.getElementById('header');
        header.classList.remove('p-header__dark', 'p-header__border');
        return;
    }

    if (scrollTop >= windowHeight) {
        const header = document.getElementById('header');
        header.classList.add('p-header__dark', 'p-header__border');
    }

    const scrollBottom = scrollTop + windowHeight;

    const thirdSectionContent = document.getElementById('third-section-content');
    if (scrollBottom >= window.scrollY + thirdSectionContent.getBoundingClientRect().top) {
        thirdSectionContent.classList.add('section__text-wrapper-animation');
    }

    const thirdSectionLeftImage = document.getElementById('third-section-left-image');
    if (scrollBottom >= window.scrollY + thirdSectionLeftImage.getBoundingClientRect().top) {
        const leftImage = document.getElementById('third-section-left-image');
        const rightImage = document.getElementById('third-section-right-image');
        leftImage.classList.add('third-section__left_image_animation');
        rightImage.classList.add('third-section__right_image_animation');
    }

    const innerWidth = window.innerWidth;

    const thirdLeftImage = document.getElementById('left-image');
    const thirdLeftImageBottom = window.scrollY + thirdLeftImage.getBoundingClientRect().bottom;
    if (innerWidth <= 768 && thirdLeftImageBottom <= scrollBottom + 100) {
        const thirdImageWrapper = document.getElementById('third-section-image');
        const moveX = Math.max(0, Math.min(1, 100 / (scrollBottom + 100 - thirdLeftImageBottom)));
        thirdImageWrapper.style.transform = `translate3d(calc(((650px - 100vw) * ${moveX}) - (650px - 100vw)), 0px, 0px)`;
    }

    const fourthSectionH1 = document.getElementById('fourth-h1');
    if (scrollBottom >= window.scrollY + fourthSectionH1.getBoundingClientRect().top) {
        const fourthSectionContent = document.getElementById('fourth-section-content');
        fourthSectionContent.classList.add('section__text-wrapper-animation');
    }

    const fourthSectionImage = document.getElementById('fourth-section-image');
    if (scrollBottom >= window.scrollY + fourthSectionImage.getBoundingClientRect().top + 50) {
        const leftImage = document.getElementById('fourth-section-image');
        leftImage.classList.add('fourth-section__image_animation');
    }
}
