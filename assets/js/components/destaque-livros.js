import { criarSlug } from '/assets/js/utils/criar-slug.js';

async function carregarLivros() {
    const res = await fetch('/api/livros?limit=6');

    if (!res.ok) {
        throw new Error(`Erro ao carregar livros: ${res.status}`);
    }

    return await res.json();
}


function criarCardMais() {
    const card = document.createElement("div");

    card.classList.add(
        "card-livro-destaque",
        "card-mais"
    );

    card.innerHTML = `
        <div id="container-livro">
            <div class="icone-mais">➜</div>
            <p id="titulo-livro">Ver todos</p>
        </div>
    `;

    card.addEventListener("click", () => {
        window.location.href = "/livros";
    });

    return card;
}


function criarCardLivro(livro, caminho) {
    const card = document.createElement("div");

    card.classList.add("card-livro-destaque");

    card.innerHTML = `
        <div id="container-livro">
            <a
                class="capa-livro"
                href="/livros/${caminho}"
            >
                <img
                    class="capa-livro"
                    src="/livros/${caminho}/capa.webp"
                    alt="${livro.titulo}"
                >
            </a>
        </div>
    `;

    return card;
}


export async function criarDestaqueLivros() {
    const container = document.getElementById("lista-livros");

    try {
        const livros = await carregarLivros();
        console.log(livros)

        container.replaceChildren();

        livros.forEach(livro => {
            const slug_categoria = criarSlug(livro.categorias[0].nome)
            const slug_livro = criarSlug(livro.titulo, livro.idiomas[0].codigo)
            const caminho = `${slug_categoria}/${slug_livro}`
            
            const card = criarCardLivro(livro, caminho);
            container.appendChild(card);
        });

        container.appendChild(criarCardMais());

    } catch (erro) {
        console.error("Erro ao carregar destaque:", erro);
    }
}