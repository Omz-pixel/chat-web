const body = document.getElementById('body_background');
const background = document.getElementById('background');
const container = document.querySelector('.container');
const logForm = document.getElementById('log-form');
const log2Form = document.getElementById('log2-form');
const fixedBackground = 'url("pics/signUp_blur.png")';

let backgroundInterval;

const backgrounds = [
    'url("pics/pic1.jpeg")',
    'url("pics/pic2.jpeg")',
    'url("pics/pic3.jpeg")'
];

const blurBackgrounds = [
    'url("pics/blur1.png")',
    'url("pics/blur2.png")',
    'url("pics/blur3.png")'
];

let currentBackgroundIndex = 0;

function startBackgroundRotation() {
    backgroundInterval = setInterval(() => {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        background.style.backgroundImage = backgrounds[currentBackgroundIndex];
        body.style.backgroundImage = blurBackgrounds[currentBackgroundIndex];
    }, 5000);
}

function stopBackgroundRotation() {
    clearInterval(backgroundInterval);
    body.style.backgroundImage = fixedBackground;
}

document.addEventListener('DOMContentLoaded', () => {
    startBackgroundRotation();
});

function sign_up(event) {
    event.preventDefault();
    stopBackgroundRotation();
    background.classList.add('hidden');
    background.classList.remove('visible');

    logForm.classList.remove('visible');
    logForm.classList.add('hidden');
    log2Form.classList.remove('hidden');
    log2Form.classList.add('visible');
    container.style.width = "auto";
    container.style.height = "auto";
    container.style.padding = "2%";
}

function log_in(event) {
    event.preventDefault();
    startBackgroundRotation();
    body.style.backgroundImage = blurBackgrounds[currentBackgroundIndex];

    background.classList.remove('hidden');
    background.classList.add('visible');
    background.style.backgroundImage = backgrounds[currentBackgroundIndex];

    log2Form.classList.remove('visible');
    log2Form.classList.add('hidden');
    logForm.classList.remove('hidden');
    logForm.classList.add('visible');
    container.style.width = "80vw";
    container.style.height = "500px";
    container.style.padding = "0";
}
