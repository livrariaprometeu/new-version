function loadHeader() {
  const livrosSalvos = JSON.parse(localStorage.getItem('meusLivros')) || [];

  const headerHTML = `
    <header class="container site-header" role="banner" aria-label="Cabeçalho do site">
      <a href="https://livrariaprometeu.com" class="brand">
        <img 
          src="https://livrariaprometeu.com/03_MIDIA/logos/livraria_prometeu_original.webp" 
          alt="Logotipo Livraria Prometeu">
      </a>

      <nav class="nav-wrap" role="navigation" aria-label="Menu principal">
        <a href="https://livrariaprometeu.com">Home</a>
        <a href="https://livrariaprometeu.com/blog">Blog</a>
        <a href="https://livrariaprometeu.com/livros">Books</a>

        ${
          livrosSalvos.length > 0
            ? `<div class="meus-livros">
                <button class="btn-meus-livros">📚 Meus livros (${livrosSalvos.length})</button>
                <ul class="lista-livros">
                  ${livrosSalvos
                    .map(
                      (l) => `<li><a href="${l.link || '#'}">${l.titulo}</a></li>`
                    )
                    .join('')}
                </ul>
              </div>`
            : ''
        }
      </nav>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // interatividade: abre/fecha a lista ao clicar
  const btn = document.querySelector('.btn-meus-livros');
  const lista = document.querySelector('.lista-livros');
  if (btn && lista) {
    btn.addEventListener('click', () => {
      lista.classList.toggle('visivel');
    });
  }
}

// garante que só executa quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', loadHeader);

// atualiza o header ao salvar novos livros
window.addEventListener('livrosAtualizados', () => {
  document.querySelector('.site-header')?.remove();
  loadHeader();
});
