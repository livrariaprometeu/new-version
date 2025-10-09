function loadHeader() {
  const headerHTML = `
    <header class="container" role="banner" aria-label="Cabeçalho do site">
      <a href="https://livrariaprometeu.com/index.html" class="brand" aria-hidden="false">
        <img src="" alt="Logotipo Livraria Prometeu">
      <a>  
      <nav class="nav-wrap" role="navigation" arial-label="Menu principal">
        <a href="https://livrariaprometeu.com/01_SITE/html/artigos/index.html">Blog</a>
        <a href="https://livrariaprometeu.com/01_SITE/html/ebooks.html">E-books</a>
        <a href="https://livrariaprometeu.com/01_SITE/html/livros.html">Livros</a>
      </nav>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
}