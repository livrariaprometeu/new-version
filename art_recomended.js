// CARREGAR ARTIGOS DE FORMA ALEATÓRIA POR CATEGORIA, COM FALLBACK
let artigos = [];

// Função para embaralhar um array (algoritmo de Fisher–Yates)
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função principal
function carregarArtigos(categoria) {
  fetch('https://livrariaprometeu.com/blog/artigos.json')
    .then(res => res.json())
    .then(data => {
      // Filtra por categoria
      const daCategoria = data.filter(item => item.category === categoria);
      const foraCategoria = data.filter(item => item.category !== categoria);

      let resultadoFinal = [];

      if (daCategoria.length >= 3) {
        // Se há 3 ou mais, embaralha e pega 3
        resultadoFinal = embaralhar(daCategoria).slice(0, 3);
      } else {
        // Caso contrário, complementa com artigos de outras categorias
        const faltam = 3 - daCategoria.length;
        const adicionais = embaralhar(foraCategoria).slice(0, faltam);
        resultadoFinal = embaralhar([...daCategoria, ...adicionais]);
      }

      renderArtigos(resultadoFinal);
    })
    .catch(err => console.error('Erro ao carregar artigos:', err));
}

// Renderização simples
function renderArtigos(lista) {
  const grid = document.getElementById('articleGrid');
  grid.innerHTML = '';

  lista.forEach(e => {
    const card = document.createElement('div');
    card.className = 'card-artigo';
    card.innerHTML = `
      <h3>${e.titulo}</h3>
      <p>${e.categoria}</p>
    `;
    grid.appendChild(card);
  });
}
