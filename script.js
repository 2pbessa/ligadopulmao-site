/* ================================================================
   Liga do Pulmão e Fisioterapia — JavaScript do protótipo

   PARA PERSONALIZAR:
   1. Edite a lista inicial `initialResources` logo abaixo.
   2. Cada item tem um tipo (video, document, quiz, audio, link ou article).
   3. Use `collection` para agrupar vários itens numa mesma trilha.
   4. Para vídeos/documentos, adicione `url`. Os quizzes usam `quiz`.

   Todos os conteúdos são definidos no array `initialResources` abaixo.
   Não há formulário de cadastro, banco de dados ou gravação de mídias no navegador.
   Para publicar arquivos, coloque-os em `midias/` e informe o caminho em `url`.
   ================================================================ */

// 1) CONTEÚDOS INICIAIS
// Edite os itens abaixo para definir todo o acervo exibido no site.
// Dica: itens com o mesmo campo "collection" aparecem agrupados na mesma trilha.
// Tipos disponíveis: video, document, quiz, audio, link e article.
const initialResources = [
  {
    id: "intro-video",
    title: "Conhecendo a saúde pulmonar",
    description: "Uma introdução demonstrativa para abrir uma trilha de educação em saúde.",
    collection: "Primeiros passos",
    type: "video",
    duration: "Vídeo • edite o campo url",
    tags: ["introdução", "saúde pulmonar"],
    url: "",
    createdAt: 1
  },
  {
    id: "breathing-guide",
    title: "Guia de respiração: material de apoio",
    description: "Edite este item em initialResources e informe o caminho do PDF no campo url.",
    collection: "Primeiros passos",
    type: "document",
    duration: "PDF • edite o campo url",
    tags: ["guia", "documento", "material de apoio"],
    url: "",
    createdAt: 2
  },
  {
    id: "learning-check",
    title: "O que você aprendeu?",
    description: "Um quiz simples de demonstração para conferir a compreensão do conteúdo.",
    collection: "Primeiros passos",
    type: "quiz",
    duration: "3 perguntas",
    tags: ["quiz", "aprendizagem"],
    quiz: {
      // Cada objeto representa uma pergunta exibida em sequência.
      questions: [
        {
          question: "Qual é uma boa característica de um conteúdo educativo em saúde?",
          options: [
            "Ser claro, acessível e apoiar a conversa com profissionais",
            "Substituir toda avaliação feita por um profissional",
            "Prometer o mesmo resultado para todas as pessoas"
          ],
          correct: "Ser claro, acessível e apoiar a conversa com profissionais"
        },
        {
          question: "Qual é o objetivo de um quiz ao final de uma trilha educativa?",
          options: [
            "Ajudar a revisar o que foi aprendido",
            "Substituir uma consulta de saúde",
            "Garantir que todas as pessoas aprendam da mesma forma"
          ],
          correct: "Ajudar a revisar o que foi aprendido"
        },
        {
          question: "O que fazer quando um material educativo deixa uma dúvida?",
          options: [
            "Procurar fontes confiáveis e conversar com um profissional",
            "Ignorar sempre a dúvida",
            "Considerar toda informação da internet correta"
          ],
          correct: "Procurar fontes confiáveis e conversar com um profissional"
        }
      ]
    },
    createdAt: 3
  },
  {
    id: "movement-video",
    title: "Movimento e bem-estar",
    description: "Edite este item em initialResources e informe o caminho do vídeo no campo url.",
    collection: "Movimento e bem-estar",
    type: "video",
    duration: "Vídeo • edite o campo url",
    tags: ["movimento", "bem-estar"],
    url: "",
    createdAt: 4
  },
  {
    id: "movement-notes",
    title: "Anotações e materiais complementares",
    description: "Uma seção para documentos que acompanham uma aula ou vídeo.",
    collection: "Movimento e bem-estar",
    type: "document",
    duration: "Documento • edite o campo url",
    tags: ["material de apoio", "leitura"],
    url: "",
    createdAt: 5
  },
  {
    id: "podcast-placeholder",
    title: "Conversa com a equipe",
    description: "Edite este item em initialResources e informe o caminho do áudio ou seu link público no campo url.",
    collection: "Conversas e dúvidas",
    type: "audio",
    duration: "Áudio • edite o campo url",
    tags: ["áudio", "podcast", "perguntas"],
    url: "",
    createdAt: 6
  },
  {
    id: "reading-placeholder",
    title: "Leitura complementar",
    description: "Área para um texto curto, referências ou um resumo feito pela equipe.",
    collection: "Conversas e dúvidas",
    type: "article",
    duration: "Texto",
    tags: ["leitura", "referências"],
    body: "Este é um texto de demonstração. Edite este campo no arquivo script.js para adicionar um resumo, contexto e referências revisadas pela equipe da Liga.",
    createdAt: 7
  }
];

// 2) ESTADO DA BIBLIOTECA
// O catálogo é sempre carregado desta lista; nada é cadastrado ou salvo pelo site.
const resources = initialResources;
let activeFilter = "all";
let searchTerm = "";

// Textos e símbolos exibidos para cada tipo de mídia.
const typeLabels = {
  video: "Vídeo",
  document: "Documento",
  quiz: "Quiz interativo",
  audio: "Áudio / podcast",
  link: "Link externo",
  article: "Texto / artigo"
};

const typeIcons = {
  video: "▶",
  document: "▤",
  quiz: "✓",
  audio: "♫",
  link: "↗",
  article: "Aa"
};

const resourceCollections = document.getElementById("resourceCollections");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const resourceSearch = document.getElementById("resourceSearch");
const viewerDialog = document.getElementById("viewerDialog");

// Mantém o andamento dos quizzes enquanto esta página estiver aberta.
// Assim, fechar e reabrir um quiz não libera a alteração de respostas já confirmadas.
const quizSessions = new Map();

// 3) FUNÇÕES AUXILIARES
// Os conteúdos vêm exclusivamente de initialResources, no próprio código.
// Evita que texto digitado pelo usuário seja interpretado como HTML.
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function makeTags(tags = []) {
  return tags.filter(Boolean).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

// 4) PESQUISA, FILTROS E CARTÕES
// A busca compara o texto digitado com título, descrição, trilha e palavras-chave.
function getVisibleCollections() {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const matched = resources.filter(item => {
    const matchesType = activeFilter === "all" || item.type === activeFilter;
    const searchable = [item.title, item.description, item.collection, ...(item.tags || [])].join(" ").toLocaleLowerCase("pt-BR");
    return matchesType && (!normalizedTerm || searchable.includes(normalizedTerm));
  });

  const grouped = new Map();
  matched.forEach(item => {
    const name = item.collection || "Outros conteúdos";
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(item);
  });
  return [...grouped.entries()].map(([name, items]) => ({ name, items }));
}

// Cria os cartões de conteúdo e agrupa os itens por trilha.
// Se você mudar a estrutura dos cartões no site, ajuste esta função e as classes no style.css.
function renderResources() {
  const collections = getVisibleCollections();
  const total = collections.reduce((sum, collection) => sum + collection.items.length, 0);
  resultsCount.textContent = `${total} ${total === 1 ? "conteúdo encontrado" : "conteúdos encontrados"}`;
  resourceCollections.innerHTML = "";
  emptyState.hidden = total > 0;
  resourceCollections.hidden = total === 0;

  collections.forEach((collection, index) => {
    const card = document.createElement("article");
    card.className = "collection-card";
    card.innerHTML = `
      <div class="collection-header">
        <div>
          <span class="collection-index">Trilha ${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(collection.name)}</h3>
          <p>${escapeHtml(collection.items[0]?.description || "Conteúdos selecionados para você explorar.")}</p>
        </div>
        <span class="collection-count">${collection.items.length}</span>
      </div>
      <div class="resource-list">
        ${collection.items.map(item => `
          <article class="resource-row">
            <div class="resource-icon type-${escapeHtml(item.type)}" aria-hidden="true">${typeIcons[item.type] || "•"}</div>
            <div class="resource-info">
              <span class="resource-type">${escapeHtml(typeLabels[item.type] || "Conteúdo")}</span>
              <h4 title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
              <p>${escapeHtml(item.description || "Conteúdo da biblioteca.")}</p>
              <div class="resource-detail">
                ${item.duration ? `<span>${escapeHtml(item.duration)}</span>` : ""}
                ${makeTags((item.tags || []).slice(0, 2))}
              </div>
            </div>
            <button class="resource-open" type="button" data-open-resource="${escapeHtml(item.id)}" aria-label="Abrir ${escapeHtml(item.title)}" title="Abrir conteúdo">↗</button>
          </article>
        `).join("")}
      </div>`;
    resourceCollections.appendChild(card);
  });
}

// Atualiza o filtro selecionado e redesenha a biblioteca.
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-chip").forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderResources();
}


// Abre e fecha as janelas de cadastro e visualização.
function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeDialog(dialog) {
  // O evento "close" do próprio diálogo remove a trava de rolagem.
  if (dialog?.open) dialog.close();
}


function getResourceById(id) {
  return resources.find(item => item.id === id);
}

// 5) ABERTURA DOS CONTEÚDOS
// Transforma links do YouTube/Vimeo em URLs que podem ser exibidas dentro do site.
function getVideoEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(parsed.pathname.slice(1))}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
      if (parsed.pathname.startsWith("/embed/")) return `https://www.youtube-nocookie.com${parsed.pathname}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (videoId && /^\d+$/.test(videoId)) return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch (error) {
    // Se não for uma URL válida, a função retorna uma string vazia abaixo.
  }
  return "";
}

// Reconhece extensões comuns para escolher o player adequado.
function looksLikeVideoFile(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function looksLikeAudioFile(url) {
  return /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(url);
}

function looksLikePdf(url) {
  return /\.pdf(\?.*)?$/i.test(url);
}

function openResource(id) {
  const item = getResourceById(id);
  if (!item) return;
  const viewerBody = document.getElementById("viewerBody");
  const typeLabel = document.getElementById("viewerTypeLabel");
  typeLabel.textContent = (typeLabels[item.type] || "CONTEÚDO").toLocaleUpperCase("pt-BR");

  const tags = (item.tags || []).length ? `<div class="viewer-tags">${item.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";
  const intro = `<h2 id="viewerTitle">${escapeHtml(item.title)}</h2><p class="viewer-description">${escapeHtml(item.description || "Conteúdo da biblioteca da Liga.")}</p>`;
  let bodyContent = "";

  if (item.type === "quiz") {
    bodyContent = renderQuiz(item);
  } else if (item.type === "video") {
    const embedUrl = item.url ? getVideoEmbedUrl(item.url) : "";
    if (embedUrl) {
      bodyContent = `<div class="viewer-media"><iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(item.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    } else if (item.url && looksLikeVideoFile(item.url)) {
      bodyContent = `<div class="viewer-media"><video controls playsinline src="${escapeHtml(item.url)}">Seu navegador não suporta vídeo HTML5.</video></div>`;
    } else {
      bodyContent = placeholder("▶", "Adicione o vídeo desta atividade", item.url ? "Não reconheci este formato de vídeo para reprodução incorporada. Use um link do YouTube/Vimeo ou um arquivo MP4/WEBM público." : "Este é um item demonstrativo. Para publicar o vídeo, informe o caminho do arquivo ou o link em `url`, neste item da lista `initialResources` no script.js.", item);
    }
  } else if (item.type === "document") {
    if (item.url && looksLikePdf(item.url)) {
      bodyContent = `<div class="viewer-media"><iframe src="${escapeHtml(item.url)}" title="${escapeHtml(item.title)}" loading="lazy"></iframe></div>${isSafeHttpUrl(item.url) ? openLinkButton(item.url, "Abrir PDF em nova aba") : ""}`;
    } else {
      bodyContent = placeholder("▤", "Documento ou material de leitura", item.url ? "Este documento pode abrir em uma nova aba. A visualização incorporada depende de o servidor permitir isso." : "Para publicar este material, informe o caminho do PDF ou seu link no campo `url`, neste item de `initialResources` no script.js.", item);
    }
  } else if (item.type === "audio") {
    if (item.url && looksLikeAudioFile(item.url)) {
      bodyContent = `<div class="viewer-media"><audio controls src="${escapeHtml(item.url)}">Seu navegador não suporta áudio HTML5.</audio></div>`;
    } else {
      bodyContent = placeholder("♫", "Áudio ou podcast", item.url ? "Use um link direto para um arquivo MP3, WAV, OGG ou M4A para tocar o áudio aqui." : "Para publicar este áudio, informe o caminho do arquivo ou seu link no campo `url`, em `initialResources` no script.js.", item);
    }
  } else if (item.type === "link") {
    bodyContent = placeholder("↗", "Recurso externo", item.url ? "Este conteúdo está disponível em um site externo." : "Para publicar este recurso, informe seu endereço no campo `url` deste item em `initialResources`, no script.js.", item);
  } else {
    bodyContent = `<div class="article-body">${escapeHtml(item.body || "Edite o campo body deste item na lista initialResources, no arquivo script.js.")}</div>`;
  }

  viewerBody.innerHTML = `${intro}${bodyContent}${tags}`;

  openDialog(viewerDialog);
}

function isSafeHttpUrl(url) {
  try { return ["http:", "https:"].includes(new URL(url).protocol); }
  catch (error) { return false; }
}

function openLinkButton(url, label) {
  return isSafeHttpUrl(url) ? `<div class="viewer-actions"><a class="button button-dark" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a></div>` : "";
}


function placeholder(icon, heading, message, item) {
  let action = "";
  if (isSafeHttpUrl(item.url)) action = openLinkButton(item.url, "Abrir recurso em nova aba");
  return `<div class="viewer-media"><div class="viewer-placeholder"><div class="viewer-placeholder-icon">${icon}</div><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(message)}</p></div></div>${action}`;
}

// Valida a lista de perguntas escrita no código. Cada alternativa correta
// precisa corresponder exatamente a uma das opções mostradas ao participante.
function getQuizQuestions(item) {
  const questions = item.quiz?.questions;
  if (!Array.isArray(questions)) return [];

  return questions.filter(question =>
    question &&
    typeof question.question === "string" &&
    question.question.trim() &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    question.correct &&
    question.options.includes(question.correct)
  );
}

// Prepara o quiz e recupera o andamento desta sessão, caso ele já tenha sido iniciado.
function renderQuiz(item) {
  const questions = getQuizQuestions(item);

  if (!questions.length) {
    return `<div class="viewer-media"><div class="viewer-placeholder"><div class="viewer-placeholder-icon">✓</div><h3>Quiz ainda não configurado</h3><p>Adicione perguntas, pelo menos duas alternativas para cada uma e indique a resposta correta no próprio código, dentro de initialResources.</p></div></div>`;
  }

  let session = quizSessions.get(item.id);
  if (!session || session.questions.length !== questions.length) {
    session = {
      resourceId: item.id,
      questions,
      currentIndex: 0,
      correctCount: 0,
      answered: false,
      selectedAnswer: "",
      answerIsCorrect: false,
      completed: false
    };
    quizSessions.set(item.id, session);
  }

  return `<div class="quiz-player" id="activeQuizContainer" data-quiz-id="${escapeHtml(item.id)}">
    ${renderQuizScreen(session)}
  </div>`;
}

// Desenha a pergunta atual ou, ao fim, mostra o placar do quiz.
function renderQuizScreen(session) {
  const total = session.questions.length;

  if (session.completed) {
    const percentage = Math.round((session.correctCount / total) * 100);
    return `
      <div class="quiz-result" role="status" aria-live="polite">
        <span class="quiz-result-icon" aria-hidden="true">✓</span>
        <p class="quiz-result-kicker">Quiz concluído</p>
        <h3>Você terminou esta atividade!</h3>
        <strong class="quiz-result-score">${session.correctCount}/${total}</strong>
        <p class="quiz-result-summary">Você acertou ${session.correctCount} de ${total} perguntas (${percentage}%).</p>
        <button class="button button-primary" type="button" data-close-dialog="viewerDialog">Finalizar quiz</button>
      </div>`;
  }

  const question = session.questions[session.currentIndex];
  const questionNumber = session.currentIndex + 1;
  const completedQuestions = session.currentIndex + (session.answered ? 1 : 0);
  const progress = Math.round((completedQuestions / total) * 100);
  const optionsHtml = question.options.map(option => {
    const isSelected = session.selectedAnswer === option;
    const isCorrectOption = session.answered && option === question.correct;
    const isSelectedWrong = session.answered && isSelected && !session.answerIsCorrect;
    const classes = [
      "quiz-option",
      isCorrectOption ? "is-correct-answer" : "",
      isSelectedWrong ? "is-selected-wrong" : ""
    ].filter(Boolean).join(" ");

    return `<label class="${classes}">
      <input type="radio" name="quizAnswer" value="${escapeHtml(option)}" ${isSelected ? "checked" : ""} ${session.answered ? "disabled" : ""}>
      <span>${escapeHtml(option)}</span>
    </label>`;
  }).join("");

  let feedback = "";
  if (session.answered && session.answerIsCorrect) {
    feedback = `<div class="quiz-feedback correct" id="quizFeedback" aria-live="polite">Resposta correta! Muito bem.</div>`;
  } else if (session.answered) {
    feedback = `<div class="quiz-feedback incorrect" id="quizFeedback" aria-live="polite">Resposta incorreta. A resposta certa é: ${escapeHtml(question.correct)}</div>`;
  } else {
    feedback = `<div class="quiz-feedback" id="quizFeedback" aria-live="polite"></div>`;
  }

  const buttonLabel = session.answered
    ? (questionNumber === total ? "Ver resultado →" : "Próxima pergunta →")
    : "Confirmar resposta →";

  return `
    <div class="quiz-progress-heading">
      <span>Pergunta ${questionNumber} de ${total}</span>
      <span>${progress}% concluído</span>
    </div>
    <div class="quiz-progress-track" aria-hidden="true">
      <div class="quiz-progress-bar" style="width: ${progress}%"></div>
    </div>
    <form class="quiz-question" id="activeQuizForm" data-quiz-id="${escapeHtml(session.resourceId)}">
      <h3>${escapeHtml(question.question)}</h3>
      <div class="quiz-options">${optionsHtml}</div>
      ${feedback}
      <p class="quiz-lock-note">Depois de confirmar, você não poderá alterar essa resposta nem voltar a perguntas anteriores.</p>
      <button class="button button-primary" type="submit">${buttonLabel}</button>
    </form>`;
}

// 6) MENU PARA CELULAR
function toggleMobileMenu() {
  const menu = document.getElementById("mainNav");
  const button = document.getElementById("menuToggle");
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  button.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  menu.classList.toggle("is-open", !isOpen);
}

// EVENTOS DA PÁGINA
// A delegação permite abrir cartões que são criados depois pelo JavaScript.
document.addEventListener("click", event => {
  const openButton = event.target.closest("[data-open-resource]");
  if (openButton) openResource(openButton.dataset.openResource);

  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) closeDialog(document.getElementById(closeButton.dataset.closeDialog));

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) setFilter(filterButton.dataset.filter);

  const footerFilter = event.target.closest("[data-footer-filter]");
  if (footerFilter) {
    setFilter(footerFilter.dataset.footerFilter);
    document.getElementById("conteudos").scrollIntoView({ behavior: "smooth" });
  }
});

// Navegação principal, pesquisa e filtros da biblioteca.
document.getElementById("menuToggle").addEventListener("click", toggleMobileMenu);
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("mainNav").classList.remove("is-open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
}));
// A pesquisa atualiza a biblioteca enquanto a pessoa digita.
resourceSearch.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderResources();
});
document.getElementById("clearSearch").addEventListener("click", () => {
  resourceSearch.value = "";
  searchTerm = "";
  setFilter("all");
});

// Atalho opcional: Ctrl+K (Windows/Linux) ou Cmd+K (Mac) leva o foco à busca.
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    resourceSearch.focus();
    document.getElementById("conteudos").scrollIntoView({ behavior: "smooth" });
  }
});

// Corrige uma resposta uma única vez e só permite seguir para a próxima pergunta.
// Não existe botão de voltar; depois da confirmação, as alternativas ficam bloqueadas.
document.addEventListener("submit", event => {
  if (event.target.id !== "activeQuizForm") return;
  event.preventDefault();

  const form = event.target;
  const quizId = form.dataset.quizId;
  const session = quizSessions.get(quizId);
  const quizContainer = document.getElementById("activeQuizContainer");
  if (!session || !quizContainer || session.completed) return;

  // Se a resposta já foi confirmada, o botão avança ou mostra o placar final.
  if (session.answered) {
    if (session.currentIndex < session.questions.length - 1) {
      session.currentIndex += 1;
      session.answered = false;
      session.selectedAnswer = "";
      session.answerIsCorrect = false;
    } else {
      session.completed = true;
    }

    quizContainer.innerHTML = renderQuizScreen(session);
    return;
  }

  const selected = form.querySelector('input[name="quizAnswer"]:checked');
  if (!selected) {
    const feedback = form.querySelector("#quizFeedback");
    feedback.className = "quiz-feedback incorrect";
    feedback.textContent = "Selecione uma alternativa antes de confirmar.";
    return;
  }

  // Registra o resultado e redesenha a pergunta com as respostas bloqueadas.
  const currentQuestion = session.questions[session.currentIndex];
  session.selectedAnswer = selected.value;
  session.answerIsCorrect = selected.value === currentQuestion.correct;
  session.answered = true;

  if (session.answerIsCorrect) session.correctCount += 1;
  quizContainer.innerHTML = renderQuizScreen(session);
});


// Fecha uma janela quando a pessoa clica na área escura ao redor do painel.
// O navegador também fecha o diálogo com a tecla Esc.
[viewerDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    if (!viewerDialog.open) document.body.classList.remove("dialog-open");
  });
});

// INICIALIZAÇÃO
// Preenche o ano do rodapé e mostra a biblioteca ao abrir a página.
document.getElementById("currentYear").textContent = new Date().getFullYear();
renderResources();
