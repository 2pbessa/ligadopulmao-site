# Liga do Pulmão e Fisioterapia — site estático

Landing page responsiva feita com HTML, CSS e JavaScript puro. Os comentários estão em português para facilitar a leitura e a edição.

## Como abrir

1. Extraia a pasta do projeto.
2. Abra a pasta no VS Code.
3. Abra `index.html` no navegador ou use a extensão Live Server.
4. Mantenha `index.html`, `style.css` e `script.js` na mesma pasta.

## Como o conteúdo é gerenciado

**Todo o acervo é definido diretamente no código.** O site não possui formulário para cadastrar mídias, não usa banco de dados e não salva conteúdos no `localStorage`.

- `index.html`: estrutura da página, navegação, apresentação, seção Sobre e rodapé.
- `style.css`: cores, aparência dos cartões, espaçamentos, visualizador e layout responsivo.
- `script.js`: lista `initialResources`, pesquisa, filtros, visualizador e funcionamento dos quizzes.
- `midias/videos/`: coloque aqui os vídeos publicados junto com o site.
- `midias/documentos/`: coloque aqui PDFs e outros documentos.

## Como adicionar ou editar uma mídia

1. Coloque o arquivo na pasta correspondente dentro de `midias/`.
2. Abra `script.js` e localize o array `initialResources` no início do arquivo.
3. Copie um objeto existente e altere `id`, `title`, `description`, `collection`, `type`, `url`, `duration` e `tags`.
4. Informe no campo `url` o caminho relativo, por exemplo `midias/videos/aula-respiracao.mp4` ou `midias/documentos/guia-respiracao.pdf`.
5. Salve e atualize a página.

Os itens com o mesmo valor em `collection` aparecem agrupados na mesma trilha. Tipos disponíveis: `video`, `document`, `quiz`, `audio`, `link` e `article`.

## Como criar um quiz no código

Dentro de um item com `type: "quiz"`, adicione um objeto `quiz` com uma lista `questions`. Cada pergunta tem um enunciado (`question`), uma lista de alternativas (`options`) e a resposta correta (`correct`). Exemplo:

```javascript
{
  id: "quiz-respiracao",
  title: "Quiz sobre respiração",
  description: "Teste seus conhecimentos.",
  collection: "Respiração",
  type: "quiz",
  duration: "2 perguntas",
  tags: ["respiração", "quiz"],
  quiz: {
    questions: [
      {
        question: "Qual alternativa está correta?",
        options: ["Alternativa A", "Alternativa B", "Alternativa C"],
        correct: "Alternativa B"
      },
      {
        question: "Qual é a segunda resposta?",
        options: ["Resposta 1", "Resposta 2", "Resposta 3"],
        correct: "Resposta 1"
      }
    ]
  }
}
```

O participante vê uma pergunta por vez. Depois de confirmar, não pode alterar a resposta nem voltar à pergunta anterior. Ao terminar, vê a pontuação total, por exemplo `7/10`, e a porcentagem de acertos. O andamento do quiz existe apenas enquanto a página está aberta; atualizar a página reinicia a tentativa.

## Antes de publicar

Os caminhos de `midias/` precisam ser incluídos no site hospedado. Os exemplos no array `initialResources` são demonstrativos e devem ser substituídos por conteúdos aprovados pela equipe da Liga. Atualize também os links das redes sociais no `index.html`.
