import { criarSlug } from '/assets/js/utils/criar-slug.js';
import { calcularTotalArtigos } from '/assets/js/utils/calcular-qtd-artigos.js';
import { sortearNumero } from '/assets/js/utils/sortear-numero.js';
import { obterDescricaoArtigo } from '/assets/js/utils/obter-descricao-artigo.js';


let index = 0;


async function carregarArtigos(start, qtd = 3) {
    const res = await fetch(`/api/artigos?limit=${qtd}&offset=${start}`);

    if (!res.ok) {
        throw new Error(`Erro ao carregar artigos: ${res.status}`);
    }

    return res.json();
}


async function criarCardArtigo(artigo, slug) {

    const caminhoMd = `/blog/artigo/${slug}/texto.md`;

    const res = await fetch(caminhoMd);
    const texto = await res.text();

    const markdown = marked.parse(texto);
    const descricaoArtigo = obterDescricaoArtigo(markdown);

    const card = document.createElement("div");

    card.classList.add("card-destaque");

    card.innerHTML = `
        <div class="capa-artigo-container">

            <img 
                class="capa-destaque"
                src="/blog/artigo/${slug}/capa.webp"
            >

            <div class="container-artigo-destaque">

                <div class="idioma-artigo-destaque">
                    ${artigo.idiomas[0].nome}
                </div>

                <p class="titulo-artigo-destaque">
                    ${artigo.titulo}
                </p>

                <p class="conteudo-artigo-destaque">
                    ${descricaoArtigo}
                </p>

            </div>

        </div>
    `;

    return card;
}


function criarIndicadores(qtd) {

    const container = document.getElementById("indicadores");

    container.innerHTML = "";

    for (let i = 0; i < qtd; i++) {

        const bolinha = document.createElement("div");

        bolinha.classList.add("bolinha");

        if (i === 0) {
            bolinha.classList.add("ativa");
        }

        container.appendChild(bolinha);
    }
}


function atualizarIndicadores(index) {

    const bolinhas = document.querySelectorAll(".bolinha");

    bolinhas.forEach((bolinha, i) => {

        bolinha.classList.toggle(
            "ativa",
            i === index
        );

    });
}


function slide(artigos, track) {

    index = (index + 1) % artigos.length;

    track.style.transform = `translateX(-${index * 100}%)`;

    atualizarIndicadores(index);
}


export async function gerarDestaqueArtigo() {

    const container = document.getElementById("track-destaque");

    container.innerHTML = "";

    const qtdArtigos = await calcularTotalArtigos();

    const numero = sortearNumero(qtdArtigos - 4);

    const artigos = await carregarArtigos(numero);

    for (const artigo of artigos) {

        const slug = criarSlug(artigo.titulo);

        const card = await criarCardArtigo(
            artigo,
            slug
        );

        container.appendChild(card);
    }

    criarIndicadores(artigos.length);

    setInterval(() => {
        slide(artigos, container);
    }, 10000);
}


gerarDestaqueArtigo();