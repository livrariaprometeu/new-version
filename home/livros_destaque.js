fetch("/livros/data/livros.json")
  .then(res => res.json())
  .then(dados => {

    const container = document.getElementById("lista-livros");

    // Limita a 6 livros
    const livrosExibidos = dados.slice(0, 6);
    let caminhoLer = "/livros/"

    livrosExibidos.forEach(item => {

        const div = document.createElement("div");

        div.classList.add("card-livro-destaque");

        div.innerHTML = `
            <div id="container-livro">
                <a class="capa-livro" href="${caminhoLer}${item.caminho}" alt="${item.titulo}>
                    <img class="capa-livro" src="/livros/${item.caminho}/capa.webp">
                </a>
            </div>
        `;

        container.appendChild(div);
    });

    // Adiciona o card "Mais"
    const cardMais = document.createElement("div");

    cardMais.classList.add("card-livro-destaque", "card-mais");

    cardMais.innerHTML = `
        <div id="container-livro" class="container-mais-livros">
            <div class="icone-mais">➜</div>
            <p id="titulo-livro">Ver todos</p>
        </div>
    `;

    cardMais.addEventListener("click", () => {
        window.location.href = "/livros";
    });

    container.appendChild(cardMais);
});