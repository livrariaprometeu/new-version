export function criarCardLivro(livro, caminho) {
    const card = document.createElement("div");

    let nota = livro.avaliacao_prometeu
    console.log(livro, nota)

    let html = "";
    for (let i = 1; i <= 5; i++) {
    if (i <= nota) {
        html += "★";
    } else {
        html += "☆";
    }
    }
    
    card.classList.add("card");

    card.innerHTML = `
            <div id="container-livro">
                <div id="idioma-livro">${livro.idiomas[0].nome}</div>
                <div class="capa-livro"><img class="capa-livro" src="/livros/${caminho}/capa.webp"></div>
                <p id="titulo-livro">${livro.titulo}</p>
                <p id="autor-livro">${livro.autor}</p>
                <div id="informacoes-livro">
                    <p class="informacao-livro" id="categoria-livro">${livro.categorias[0].nome}</p>
                    <p class="informacao-livro" id="categoria-estrelas">${html}</p>
                </div>
                <p class="ler-livro" id="ler-livro">Ler</p>
                <p class="mais-livro" id="mais-livro">Mais</p>
            </div>
        `;

    return card;
}