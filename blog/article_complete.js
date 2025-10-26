// article.js
async function loadArticle(id) {
  const res = await fetch('artigos_complete.json');
  const articles = await res.json();
  const article = articles.find(a => a.id === id);
  if (!article) return;

  const main = document.querySelector('main');

  // Header do artigo
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('header');
  headerDiv.innerHTML = `
    <h1>${article.title}</h1>
    <p>Por ${article.author}</p>
  `;
  main.appendChild(headerDiv);

  // Resumo
  const resumoP = document.createElement('p');
  resumoP.textContent = article.summary;
  main.appendChild(resumoP);

  // Conteúdo
  article.content.forEach(block => {
    let element;
    switch(block.type) {
      case 'paragraph':
        element = document.createElement('p');
        element.textContent = block.text;
        break;
      case 'subtitle':
        element = document.createElement('h2');
        element.textContent = block.text;
        break;
      case 'blockquote':
        element = document.createElement('blockquote');
        element.textContent = block.text;
        break;
      case 'cta':
        element = document.createElement('div');
        element.classList.add('cta');
        element.innerHTML = `
          <p>${block.text}</p>
          <a href="${block.link}">Descubra sua próxima leitura</a>
          <p style="margin-top:1rem; color:#555;">${block.description}</p>
        `;
        break;
    }
    if (element) main.appendChild(element);
  });
}

// Carrega artigo com ID 2 (exemplo)
document.addEventListener('DOMContentLoaded', () => {
  loadArticle(2);
});
