const header = document.querySelector('header');

function atualizarHeader() {
    header.classList.toggle('com_borda', window.scrollY > 0);
}

window.addEventListener('scroll', atualizarHeader);
atualizarHeader();

const botaoMenu = document.querySelector('.menu_botao');
const menu = document.querySelector('nav');

function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu.addEventListener('click', function () {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});