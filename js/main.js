document.addEventListener('DOMContentLoaded', () => {
    console.log('Hola Mundo');
    const el = document.querySelector('h1');
    if (el) el.textContent += ' — desde JavaScript';
});
