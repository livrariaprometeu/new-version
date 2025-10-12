function loadHeader() {
  const headerHTML = `
    <header class="container" role="banner" aria-label="Cabeçalho do site">
      <a href="https://livrariaprometeu.com" class="brand" aria-hidden="false">
        <img src="https://livrariaprometeu.com/03_MIDIA/logos/livraria_prometeu_original.webp" alt="Logotipo Livraria Prometeu">
      <a>  
      <nav class="nav-wrap" role="navigation" arial-label="Menu principal">
        <a href="https://livrariaprometeu.com/blog">Blog</a>
        <a href="https://livrariaprometeu.com/livros">Livros</a>
      </nav>
    </header>livros
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
}
