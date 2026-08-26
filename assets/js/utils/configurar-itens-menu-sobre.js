import { lerArquivoMd } from '/assets/js/utils/ler-arquivo-md.js';

export function configurarItensMenu(container) {

    const itensMenu = container.querySelectorAll(".item-menu-sobre");

    itensMenu.forEach(item => {

        item.addEventListener("click", async () => {

            selecionarItem(item, itensMenu);

            atualizarTituloMobile(container, item);

            fecharMenuMobile(container);

            await carregarConteudoSobre(container, item.id);

        });

    });

}


function selecionarItem(item, itensMenu) {

    itensMenu.forEach(outroItem => {
        outroItem.classList.remove("ativo");
    });

    item.classList.add("ativo");

}


function atualizarTituloMobile(container, item) {

    const titulo = container.querySelector("#menu-sobre-mobile-titulo");

    if (!titulo) {
        return;
    }

    titulo.textContent = item.textContent.trim();

}


function fecharMenuMobile(container) {

    const toggle = container.querySelector("#menu-sobre-mobile-toggle");
    const menu = container.querySelector("#menu-de-selecao-sobre");

    if (!toggle || !menu) {
        return;
    }

    toggle.classList.remove("aberto");
    menu.classList.remove("aberto");

}

async function carregarConteudoSobre(container, id) {

    const caminho = `/sobre/${id}/texto.md`;

    console.log("Carregando:", caminho);

    const texto = await lerArquivoMd(`${caminho}`);

    if (texto === null) {
        return;
    }

    const markdown = marked.parse(texto);

    const areaMarkdown = container.querySelector("#markdown");

    if (!areaMarkdown) {
        return;
    }

    areaMarkdown.innerHTML = markdown;

}