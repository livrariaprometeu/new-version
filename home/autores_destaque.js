fetch("/autores/data/autores.json")
  .then(res => res.json())
  .then(dados => {

    const container = document.getElementById("lista-autores");

    // Limita a 6 autores
    const autoresExibidos = dados.slice(0, 6);
    let caminhoLer = "/autores/"

    autoresExibidos.forEach(item => {

        let autorLower = item.autor.toLowerCase();
        let caminho = autorLower.replace(/ /g, "-");

        const div = document.createElement("div");

        div.classList.add("card-autor-destaque");

        div.innerHTML = `
            <div id="container-autor">
                <a class="capa-autor" href="${caminhoLer}${caminho}" alt="${item.autor}">
                    <img class="capa-autor" src="/autores/${caminho}/capa.webp">
                </a>
                <p class="nome-autor">${item.autor}</p>
            </div>
        `;

        container.appendChild(div);
    });
});