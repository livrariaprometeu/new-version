let valorFiltroEstrela = 0;


// =====================================
// FILTRO DOS LIVROS
// =====================================

export function filtrarLivros() {

    const inputPesquisa = document.getElementById("pesquisa");
    const livros = document.querySelectorAll(".livro");

    const textoBusca = inputPesquisa.value
        .trim()
        .toLowerCase();

    livros.forEach(livro => {

        const texto = livro.innerText.toLowerCase();

        const avaliacao = parseInt(
            livro.getAttribute("data-avaliacao")
        );

        const matchTexto =
            texto.includes(textoBusca);

        const matchEstrelas =
            valorFiltroEstrela === 0 ||
            avaliacao >= valorFiltroEstrela;

        livro.style.display =
            matchTexto && matchEstrelas
                ? "block"
                : "none";
    });
}


// =====================================
// VISUAL DAS ESTRELAS
// =====================================

function atualizarVisualEstrelas(estrelas, valor) {

    estrelas.forEach(estrela => {

        const valorEstrela = parseInt(
            estrela.getAttribute("data-valor")
        );

        estrela.innerText =
            valorEstrela <= valor
                ? "★"
                : "☆";
    });
}


// =====================================
// FILTRO POR ESTRELAS
// =====================================

function configurarFiltroEstrelas() {

    const estrelas = document.querySelectorAll(".estrela");

    estrelas.forEach(estrela => {

        estrela.addEventListener("mouseover", () => {

            const valor = parseInt(
                estrela.getAttribute("data-valor")
            );

            atualizarVisualEstrelas(
                estrelas,
                valor
            );
        });


        estrela.addEventListener("mouseout", () => {

            atualizarVisualEstrelas(
                estrelas,
                valorFiltroEstrela
            );
        });


        estrela.addEventListener("click", () => {

            const valor = parseInt(
                estrela.getAttribute("data-valor")
            );

            if (valorFiltroEstrela === valor) {
                valorFiltroEstrela = 0;
            } else {
                valorFiltroEstrela = valor;
            }

            atualizarVisualEstrelas(
                estrelas,
                valorFiltroEstrela
            );

            filtrarLivros();
        });
    });
}


// =====================================
// INICIALIZAÇÃO
// =====================================

export function configurarFiltros() {

    const inputPesquisa =
        document.getElementById("pesquisa");

    inputPesquisa.addEventListener(
        "input",
        filtrarLivros
    );

    configurarFiltroEstrelas();
}