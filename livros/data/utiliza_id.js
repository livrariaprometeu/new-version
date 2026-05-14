const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("ID:", id);

let rendition;

async function carregarLivro() {
    try {
        const response = await fetch(`/livros/data/livro/${id}.epub`);
        const buffer = await response.arrayBuffer();

        const book = ePub(buffer);

        rendition = book.renderTo("viewer", { // ✅ sem const
            width: "100%",
            height: "100%",
            allowScriptedContent: true
        });

        await rendition.display();

        console.log("Livro renderizado!");

        rendition.themes.default({
            body: {
                "font-size": "18px",
                "line-height": "1.6"
            }
        });

        // 🔁 restaurar posição salva
        const posicao = localStorage.getItem("posicao-" + id);
        if (posicao) {
            await rendition.display(posicao);
        }

        // Exibe capitulos
        await book.ready;

        const navigation = await book.navigation;
        const toc = document.getElementById("toc");
        const buttonToc = document.getElementById("toggleToc");

        // abre/fecha o menu
        buttonToc.addEventListener("click", () => {
            toc.style.display = toc.style.display === "none" ? "block" : "none";
        });

        // cria os itens
        navigation.toc.forEach((capitulo) => {
            const item = document.createElement("div");
            item.textContent = capitulo.label;
            item.style.cursor = "pointer";
            item.style.padding = "5px";

            item.addEventListener("click", () => {
                rendition.display(capitulo.href);
                toc.style.display = "none"; // fecha depois de clicar
            });

            toc.appendChild(item);
        });

        buttonToc.textContent = "Selecione o capítulo";

        // Verifica pagina
        const NPag = document.getElementById("n-pag");
        rendition.currentLocation()

        await book.ready;
        await book.locations.generate(800);

        rendition.on("relocated", (location) => {
            const displayed = location.start.displayed;

            const paginaCapitulo = displayed.page;
            const totalCapitulo = displayed.total;

            const paginaGlobal = book.locations.locationFromCfi(location.start.cfi);
            const totalGlobal = book.locations.total;

            const percent = book.locations.percentageFromCfi(location.start.cfi);

            NPag.textContent = 
                `Página ${paginaCapitulo} de ${totalCapitulo} • ${Math.floor(percent * 100)}% do livro`;
            
            console.log(`Capítulo: ${paginaCapitulo}/${totalCapitulo}`);
            console.log(`Livro: ${paginaGlobal}/${totalGlobal}`);
        });

    } catch (err) {
        console.error("Erro geral:", err);
    }
}

carregarLivro();

document.addEventListener("keydown", (e) => {
    if (!rendition) return;

    if (e.key === "ArrowRight") rendition.next();
    if (e.key === "ArrowLeft") rendition.prev();
});

// Da funcionalidade para os botões "Anterior" e "Proximo"
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

if (btnNext) {
    btnNext.addEventListener("click", () => {
        if (rendition) rendition.next();
    });
}

if (btnPrev) {
    btnPrev.addEventListener("click", () => {
        if (rendition) rendition.prev();
    });
}