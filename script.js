const body = document.getElementById('body_background')
const background = document.getElementById('background');
const container = document.querySelector('.container')
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');


document.addEventListener('DOMContentLoaded', () => {
    

    const backgrounds = [
        'url("pics/pic1.jpeg")',
        'url("pics/pic2.jpeg")', 
        'url("pics/pic3.jpeg")' 
    ];
    const blurBackgrounds = [
        'url("pics/blur1.png")',
        'url("pics/blur2.png")', 
        'url("pics/blur3.png")'
    ]
    let currentBackgroundIndex = 0;

    setInterval(() => {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        background.style.backgroundImage = backgrounds[currentBackgroundIndex];
        body.style.backgroundImage = blurBackgrounds[currentBackgroundIndex];
    }, 5000);

    // signupForm.classList.toggle('hidden', true)

    

    // signupLink.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     loginForm.classList.toggle('hidden', true);
    //     signupForm.classList.toggle('hidden', false);
    // });

    // loginLink.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     signupForm.classList.add('hidden');
    //     loginForm.classList.remove('hidden');
    // });
});

function sign_up(){
    event.preventDefault();
    
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    background.classList.add('hidden');
    container.classList.add('form2')
    // loginForm.classList.toggle('hidden', true);
    // signupForm.classList.toggle('hidden', false);
}

function log_in(){
    event.preventDefault();
    
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    background.classList.remove('hidden');
    container.classList.remove('form2')
    // loginForm.classList.toggle('hidden', true);
    // signupForm.classList.toggle('hidden', false);
}