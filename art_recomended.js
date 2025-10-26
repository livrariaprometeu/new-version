let artigos = [];

// Carrega o JSON de artigos
fetch('https://livrariaprometeu.com/blog/artigos.json')
  .then(res => res.json())
  .then(data => {
    artigos = data;

    // Aqui você define o ID do artigo atual
    const artigoId = 2; // <— substitua pelo ID desejado
    renderArtigosRelacionados(artigoId);
  });

// Função principal — renderiza os artigos relacionados por ID
function renderArtigosRelacionados(idArtigo) {
  const grid = document.getElementById('articleGrid');
  grid.innerHTML = '';

  // Encontra o artigo atual pelo ID
  const artigoBase = artigos.find(a => a.id === idArtigo);

  if (!artigoBase) {
    console.warn('Artigo não encontrado no JSON.');
    return;
  }

  const categoria = artigoBase.category;

  // Filtra artigos da mesma categoria (excluindo o próprio)
  let relacionados = artigos.filter(
    a => a.category === categoria && a.id !== artigoBase.id
  );

  // Fallback — se houver menos de 3, completa com aleatórios de outras categorias
  if (relacionados.length < 3) {
    const restantes = artigos.filter(a => a.id !== artigoBase.id && !relacionados.includes(a));
    const aleatorios = restantes.sort(() => 0.5 - Math.random()).slice(0, 3 - relacionados.length);
    relacionados = relacionados.concat(aleatorios);
  }

  // Embaralha e limita a 3
  relacionados = relacionados.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Renderiza os artigos
  renderArtigos(relacionados);
}

// Função que realmente cria os cards no DOM
function renderArtigos(lista) {
  const grid = document.getElementById('articleGrid');
  grid.innerHTML = '';

  lista.forEach(art => {
    const card = document.createElement('div');
    card.classList.add('article-card');

    card.innerHTML = `
      <a style="text-decoration:none;" href="${art.file || '#'}" class="article-card-link">
        <img src="${art.cover}" alt="${art.title}">
        <div class="article-content">
          <h3 style="text-decoration:none;">${art.title}</h3>
          <p class="article-category" style="text-decoration:none;">${art.category}</p>
          <p class="article-summary" style="text-decoration:none;color:black">${art.summary}</p>
        </div>
      </a>
    `;

    grid.appendChild(card);
  });
}
