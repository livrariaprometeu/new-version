async function loadArticle(id) {
  // 1. Carrega metadados do JSON
  const res = await fetch('artigos.json');
  const artigos = await res.json();
  const artigo = artigos.find(a => a.id === id);
  if (!artigo) return console.error('Artigo não encontrado');

  const main = document.querySelector('main');
  main.innerHTML = '';

  // 2. Cria header, resumo, etc.
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('header');
  headerDiv.innerHTML = `<h1>${artigo.title}</h1><p>Por ${artigo.author}</p>`;
  main.appendChild(headerDiv);

  const resumoP = document.createElement('p');
  resumoP.textContent = artigo.summary;
  main.appendChild(resumoP);

  // 3. Carrega conteúdo do arquivo de texto
  const conteudoRes = await fetch(`article_content/${id}.txt`);
  const conteudo = await conteudoRes.text();

  // 4. Insere o conteúdo no main
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('article-content');
  
  // Opcional: quebrar linhas em parágrafos
  conteudo.split('\n\n').forEach(paragrafo => {
    const p = document.createElement('p');
    p.textContent = paragrafo.trim();
    contentDiv.appendChild(p);
  });

  main.appendChild(contentDiv);
}