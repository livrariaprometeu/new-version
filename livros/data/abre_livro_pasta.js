// Descobre qual foi o artigo carregado
const partes = window.location.pathname.split('/').filter(Boolean);
const resultado = partes.at(-1);

let rendition;

async function carregarLivro() {
    try {

        const caminhoLivro =
            `/livros/data/livro/${resultado}/livro/ODIN/content.opf`;

        const book = ePub(caminhoLivro);

        console.log("book", book);

        rendition = book.renderTo("viewer", {
            width: "100%",
            height: "100%",
            allowScriptedContent: true
        });

        await book.ready;

        await rendition.display();

        console.log("Livro renderizado!");

        rendition.themes.default({
            body: {
                "font-size": "18px",
                "line-height": "1.6"
            }
        });

        // Restaurar posição salva
        const posicao = localStorage.getItem("posicao-" + resultado);

        if (posicao) {
            await rendition.display(posicao);
        }

        // Navegação / capítulos
        const toc = document.getElementById("toc");
        const buttonToc = document.getElementById("toggleToc");

        const navigation = book.navigation;

        buttonToc.addEventListener("click", () => {
            toc.style.display =
                toc.style.display === "none" ? "block" : "none";
        });

        navigation.toc.forEach((capitulo) => {
            const item = document.createElement("div");

            item.textContent = capitulo.label;
            item.style.cursor = "pointer";
            item.style.padding = "5px";

            item.addEventListener("click", async () => {
                await rendition.display(capitulo.href);
                toc.style.display = "none";
            });

            toc.appendChild(item);
        });

        buttonToc.textContent = "Selecione o capítulo";

        // Gerar localizações para cálculo de páginas
        await book.locations.generate(800);

        const NPag = document.getElementById("n-pag");

        rendition.on("relocated", (location) => {

            const displayed = location.start.displayed;

            const paginaCapitulo = displayed.page;
            const totalCapitulo = displayed.total;

            const paginaGlobal =
                book.locations.locationFromCfi(location.start.cfi);

            const totalGlobal = book.locations.total;

            const percent =
                book.locations.percentageFromCfi(location.start.cfi);

            NPag.textContent =
                `Página ${paginaCapitulo} de ${totalCapitulo} • ${Math.floor(percent * 100)}% do livro`;

            console.log(
                `Capítulo: ${paginaCapitulo}/${totalCapitulo}`
            );

            console.log(
                `Livro: ${paginaGlobal}/${totalGlobal}`
            );

            // salva posição
            localStorage.setItem(
                "posicao-" + resultado,
                location.start.cfi
            );
        });

    } catch (err) {
        console.error("Erro geral:", err);
    }
}

carregarLivro();

// Navegação por teclado
document.addEventListener("keydown", (e) => {

    if (!rendition) return;

    if (e.key === "ArrowRight") {
        rendition.next();
    }

    if (e.key === "ArrowLeft") {
        rendition.prev();
    }
});

// Botões
document.getElementById("next")?.addEventListener("click", () => {
    rendition?.next();
});

document.getElementById("prev")?.addEventListener("click", () => {
    rendition?.prev();
});