import { criarSlug } from '/assets/js/utils/criar-slug.js';

async function carregarAutores() {
    const res = await fetch('/api/nomes_autores');

    if (!res.ok) {
        throw new Error(`Erro ao carregar autores: ${res.status}`);
    }

    return await res.json();
}

function criarCardAutor(slug_autor, nome_autor) {
    const card = document.createElement("div");

    card.classList.add("card-autor-destaque");

    card.innerHTML = `
            <div id="container-autor">
                <a class="capa-autor" href="/autores/${slug_autor}" alt="${nome_autor}">
                    <img class="capa-autor" src="/autores/${slug_autor}/capa.webp">
                </a>
                <p class="nome-autor">${nome_autor}</p>
            </div>
        `;

    return card;
}

export async function criarDestaqueAutores() {
    const container = document.getElementById("lista-autores");

    try {
        const autores = await carregarAutores();
        console.log(autores)

        container.replaceChildren();

        autores.forEach(autor => {
            const slug_autor = criarSlug(autor.nome_fantasia)
            
            const card = criarCardAutor(slug_autor, autor.nome_fantasia);
            container.appendChild(card);
        });

        container.appendChild(criarCardMais());

    } catch (erro) {
        console.error("Erro ao carregar destaque:", erro);
    }
}