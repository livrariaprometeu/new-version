function loadHeader() {
  const headerHTML = `
    <header class="container">
      <div class="logo">Prometeu</div>
      <nav>
        <a href="index.html">Início</a>
        <a href="ebooks-gratuitos.html">E-books</a>
        <a href="blog.html">Destaques</a>
        <a href="links.html">Loja</a>
      </nav>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
}