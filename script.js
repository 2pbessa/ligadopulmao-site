const header = document.querySelector('header');

function atualizarHeader() {
    header.classList.toggle('com_borda', window.scrollY > 0);
}

window.addEventListener('scroll', atualizarHeader);
atualizarHeader();