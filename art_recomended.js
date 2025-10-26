// === Carregar artigos de forma aleatória com fallback ===

// Função de embaralhar — algoritmo de Fisher–Yates
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
      // Filtra artigos por categoria exata (case-insensitive)
      const daCategoria = data.filter(item => item.category.toLowerCase() === categoria.toLowerCase());
      const foraCategoria = data.filter(item => item.category.toLowerCase() !== categoria.toLowerCase());

      let resultadoFinal = [];

      // Se há pelo menos 3 da categoria, usa só eles
      if (daCategoria.length >= 3) {
        resultadoFinal = embaralhar(daCategoria).slice(0, 3);
      } else {
        // Caso contrário, completa com artigos aleatórios de outras categorias
        const faltam = 3 - daCategoria.length;
        const adicionais = embaralhar(foraCategoria).slice(0, faltam);
        resultadoFinal = embaralhar([...daCategoria, ...adicionais]);
      }

      renderArtigos(resultadoFinal);
    })
    .catch(err => console.error('Erro ao carregar artigos:', err));
}

// Função de renderização
function renderArtigos(lista) {
  const grid = document.getElementById('articleGrid');
  grid.innerHTML = '';

  lista.forEach(e => {
    const card = document.createElement('a');
    card.href = e.file;
    card.className = 'artigo-card';
    card.style.display = 'block';
    card.style.marginBottom = '2rem';
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    card.innerHTML = `
      <img src="${e.cover}" alt="${e.title}" style="width:100%; border-radius:8px; box-shadow:0 8px 25px rgba(0,0,0,0.08);">
      <h3 style="margin-top:1rem;">${e.title}</h3>
      <p style="color:#555; font-size:0.9rem;">${e.category} — ${e.date}</p>
      <p style="color:#333; font-size:0.95rem;">${e.summary}</p>
    `;
    grid.appendChild(card);
  });
}
