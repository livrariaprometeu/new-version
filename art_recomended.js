let artigos = [];

// Carrega o JSON de artigos
fetch('https://livrariaprometeu.com/blog/artigos.json')
  .then(res => res.json())
  .then(data => {
    artigos = data;

    // Detecta automaticamente o título do artigo atual (pelo <h1>)
    const tituloElemento = document.querySelector('h1');
    if (tituloElemento) {
      const titulo = tituloElemento.textContent.trim();
      renderArtigosRelacionados(titulo);
    } else {
      console.warn("Nenhum <h1> encontrado para identificar o artigo atual.");
    }
  });

// Função principal — renderiza os artigos relacionados
function renderArtigosRelacionados(tituloArtigo) {
  const grid = document.getElementById('articleGrid');
  grid.innerHTML = '';

  // Normaliza o título (sem acentos, sem diferença de maiúsculas)
  const tituloNormalizado = removerAcentos(tituloArtigo.toLowerCase());

  // Encontra o artigo atual
  const artigoBase = artigos.find(a =>
    removerAcentos(a.title.toLowerCase()) === tituloNormalizado
  );

  if (!artigoBase) {
    console.warn('Artigo não encontrado no JSON.');
    return;
  }

  const categoria = artigoBase.category;

  // Filtra artigos da mesma categoria (excluindo o próprio)
  let relacionados = artigos.filter(
    a => a.category === categoria && a.title !== artigoBase.title
  );

  // Fallback — se houver menos de 3, completa com aleatórios de outras categorias
  if (relacionados.length < 3) {
    const restantes = artigos.filter(a => a.title !== artigoBase.title && !relacionados.includes(a));
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
      <a href="${art.link || '#'}" class="article-card-link">
        <img src="${art.image}" alt="${art.title}">
        <div class="article-content">
          <h3>${art.title}</h3>
          <p class="article-category">${art.category}</p>
        </div>
      </a>
    `;

    grid.appendChild(card);
  });
}

// Remove acentos e normaliza o texto para comparações
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
