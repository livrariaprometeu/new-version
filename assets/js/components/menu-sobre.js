import { configurarItensMenu } from '/assets/js/utils/configurar-itens-menu-sobre.js';

function configurarMenuMobile(container) {

    const toggle = container.querySelector("#menu-sobre-mobile-toggle");
    const menu = container.querySelector("#menu-de-selecao-sobre");

    if (!toggle || !menu) {
        return;
    }

    toggle.addEventListener("click", () => {

        toggle.classList.toggle("aberto");
        menu.classList.toggle("aberto");

    });

}

export function configurarMenuSobre(container) {

    configurarMenuMobile(container);
    configurarItensMenu(container);

}

export function marcarItemAtivo(container, caminho_md) {

    const partes = caminho_md.split("/");

    const id = partes[2];

    const item = container.querySelector(`#${CSS.escape(id)}`);

    if (item) {

        item.classList.add("ativo");

        // Atualiza o título do menu mobile
        const titulo = container.querySelector("#menu-sobre-mobile-titulo");

        if (titulo) {
            titulo.textContent = item.textContent.trim();
        }

    }
}