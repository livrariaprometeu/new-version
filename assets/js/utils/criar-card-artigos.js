import { obterDescricaoArtigo } from '/assets/js/utils/obter-descricao-artigo.js';

export async function criarCardArtigo(artigo, slug) {

    const caminhoMd = `/blog/artigo/${slug}/texto.md`;

    const res = await fetch(caminhoMd);
    const texto = await res.text();

    const markdown = marked.parse(texto);
    const descricaoArtigo = obterDescricaoArtigo(markdown);

    const card = document.createElement("div");

    card.classList.add("card-destaque");

    card.innerHTML = `
            <div id="container-artigo">
                <div id="idioma-artigo">${artigo.idiomas[0].nome}</div>
                <div class="capa-artigo"><img class="capa-artigo" src="/blog/artigo/${slug}/capa.webp"></div>
                <div id="infos-artigo">
                    <p id="titulo-artigo">${artigo.titulo}</p>
                    <div id="informacoes-artigo">
                        <p class="informacao-artigo" id="categoria-livro">${descricaoArtigo}</p>
                    </div>
                </div>
            </div>
        `;

    return card;
}