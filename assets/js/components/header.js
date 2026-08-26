function criarHeader() {
    const card = document.createElement("div");

    card.classList.add("header");

    card.innerHTML = `
            <nav id="header">
                <div id="definir-posicao-header">
                    <a href="/"><img class="logo-header" src="/header/logo/livraria_prometeu_original.webp"></a>

                    <div id="container-element-header" style="text-decoration: none;">
                        <a href="/blog" class="header-link-text"><div class="element-header" id="header-blog">Blog</div></a>
                        <a href="/livros" class="header-link-text"><div class="element-header" id="header-livros">Livros</div></a>
                        <a href="/" class="header-link-text"><div class="element-header" id="header-home">Home</div></a>
                    </div>
                </div>
            </nav>
    `;

    return card;
}

function identificarHeaderAtivo() {
    const path = window.location.pathname;

    if (path.includes("blog")) {
        return "header-blog";
    }

    if (path.includes("livros")) {
        return "header-livros";
    }

    return "header-home";
}

function ativarHeader() {
    const idAtivo = identificarHeaderAtivo();

    document
        .getElementById(idAtivo)
        ?.classList.add("ativo-header");
}

export async function aplicarHeader() {
    const container = document.getElementById("header-container");

    try {
        container.replaceChildren();

        const header = criarHeader();

        container.appendChild(header);

        ativarHeader();

    } catch (erro) {
        console.error("Erro ao carregar header:", erro);
    }
}