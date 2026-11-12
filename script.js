const header = document.querySelector('header');

// isso faz a borda do cabeçalho aparecer só depois de rolar a página
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

// fecha o menu quando se clica em um link
menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});

// funções dos vídeos

// identifica o vídeo na barra de endereço (video.html?id=...)
function idDoVideo(video) {
    return video.youtube || 'exemplo' + videos.indexOf(video);
}

// procura na lista o vídeo que tem esse identificador
function acharVideo(id) {
    return videos.find(function (video) {
        return idDoVideo(video) === id;
    });
}

// monta o card de vídeo (thumb, título, descrição e link)
function criarCard(video) {
    const link = 'video.html?id=' + encodeURIComponent(idDoVideo(video));
    const imagem = video.youtube
        ? `<img src="https://img.youtube.com/vi/${encodeURIComponent(video.youtube)}/hqdefault.jpg" alt="" loading="lazy">`
        : '';

    const card = document.createElement('article');
    card.className = 'video_card card_' + video.categoria;
    card.innerHTML = `
        <a class="video_thumb" href="${link}" tabindex="-1" aria-hidden="true">${imagem}</a>
        <div class="video_info">
            <h3></h3>
            <p></p>
            <a class="video_link" href="${link}">Assistir ao vídeo</a>
        </div>`;

    card.querySelector('h3').textContent = video.titulo;
    card.querySelector('p').textContent = video.descricao;
    card.querySelector('.video_link').setAttribute('aria-label', 'Assistir ao vídeo: ' + video.titulo);

    return card;
}

// seção de vídeos

const listaVideos = document.getElementById('videos_lista');

if (listaVideos) {
    const botoesFiltro = document.querySelectorAll('.videos_filtro');
    let categoriaAtual = 'todos';

    // sistema de categorias
    function mostrarVideos() {
        const filtrados = videos.filter(function (video) {
            return categoriaAtual === 'todos' || video.categoria === categoriaAtual;
        });

        listaVideos.innerHTML = '';

        if (filtrados.length === 0) {
            const aviso = document.createElement('p');
            aviso.className = 'videos_vazio';
            aviso.textContent = 'Ainda não há vídeos nesta categoria.';
            listaVideos.appendChild(aviso);
        }

        filtrados.forEach(function (video) {
            listaVideos.appendChild(criarCard(video));
        });

        botoesFiltro.forEach(function (botao) {
            botao.setAttribute('aria-pressed', botao.dataset.categoria === categoriaAtual);
        });
    }

    botoesFiltro.forEach(function (botao) {
        botao.addEventListener('click', function () {
            categoriaAtual = botao.dataset.categoria;
            mostrarVideos();
        });
    });

    mostrarVideos();
}

// página de vídeo (video.html)

const playerVideo = document.getElementById('video_player');

if (playerVideo) {
    const parametros = new URLSearchParams(window.location.search);
    const video = acharVideo(parametros.get('id'));
    const titulo = document.getElementById('video_titulo');
    const descricao = document.getElementById('video_descricao');

    if (video) {
        document.title = video.titulo + ' - Site LPF';
        titulo.textContent = video.titulo;
        descricao.textContent = video.descricao;

        if (video.youtube) {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(video.youtube);
            iframe.title = video.titulo;
            iframe.allowFullscreen = true;
            playerVideo.appendChild(iframe);
        } else {
            playerVideo.innerHTML = '<div class="video_player_vazio">Sem vídeo</div>';
        }
    } else {
        titulo.textContent = 'Vídeo não encontrado';
        descricao.textContent = 'Esse vídeo não existe ou foi removido. Volte e escolha outro na lista.';
        playerVideo.hidden = true;
    }

    // o "Assista também". mostra primeiro os da mesma categoria
    const outros = videos.filter(function (v) {
        return v !== video;
    });
    const mesmaCategoria = outros.filter(function (v) {
        return video && v.categoria === video.categoria;
    });
    const demais = outros.filter(function (v) {
        return !mesmaCategoria.includes(v);
    });

    const sugestoes = document.getElementById('video_sugestoes');
    mesmaCategoria.concat(demais).slice(0, 4).forEach(function (v) {
        sugestoes.appendChild(criarCard(v));
    });
}