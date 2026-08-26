function tratamentoCaminho(pag) {
    let textoMenu;

    if (pag == "politica-editorial") {
        textoMenu = "2. Política Editorial";
    } else if (pag == "politica-de-direitos-autorais") {
        textoMenu = "3. Política de Direitos Autorais";
    } else if (pag == "politica-da-biblioteca-digital") {
        textoMenu = "4. Política da Biblioteca Digital";
    } else if (pag == "politica-de-inteligencia-artificial") {
        textoMenu = "5. Política de Inteligencia Artificial";
    } else if (pag == "politica-de-conteudo-e-fontes") {
        textoMenu = "6. Política de Conteúdo e Fontes";
    } else if (pag == "politica-de-correcoes-e-atualizacoes") {
        textoMenu = "7. Política de Correções e Atualizações";
    } else if (pag == "politica-de-privacidade-e-dados") {
        textoMenu = "8. Política de Privacidade";
    } else if (pag == "politica-de-transparencia-comercial") {
        textoMenu = "9. Política de Transparência Comercial";
    } else {
        textoMenu = "1. Sobre";
    }

    return textoMenu;
}


export function criarContainerSobre(texto, caminhoMd) {

    const markdown = marked.parse(texto);

    const textoMenu = tratamentoCaminho(caminhoMd);

    const divMais = document.createElement("div");

    divMais.classList.add("card");

    divMais.innerHTML = `
        <div class="definir-tamanho-aba">

            <div id="aba-sobre-geral">

                <div id="menu-sobre-mobile-toggle">
                    <span id="menu-sobre-mobile-titulo">
                        ${textoMenu}
                    </span>

                    <span id="menu-sobre-mobile-seta">
                        ⌄
                    </span>
                </div>

                <div id="menu-de-selecao-sobre">

                    <div class="item-menu-sobre" id="nos">
                        1. Sobre
                    </div>

                    <div class="item-menu-sobre" id="politica-editorial">
                        2. Política Editorial
                    </div>

                    <div class="item-menu-sobre" id="politica-de-direitos-autorais">
                        3. Política de Direitos Autorais
                    </div>

                    <div class="item-menu-sobre" id="politica-da-biblioteca-digital">
                        4. Política da Biblioteca Digital
                    </div>

                    <div class="item-menu-sobre" id="politica-de-inteligencia-artificial">
                        5. Política de Inteligência Artificial
                    </div>

                    <div class="item-menu-sobre" id="politica-de-conteudo-e-fontes">
                        6. Política de Conteúdo e Fontes
                    </div>

                    <div class="item-menu-sobre" id="politica-de-correcoes-e-atualizacoes">
                        7. Política de Correções e Atualizações
                    </div>

                    <div class="item-menu-sobre" id="politica-de-privacidade-e-dados">
                        8. Política de Privacidade
                    </div>

                    <div class="item-menu-sobre" id="politica-de-transparencia-comercial">
                        9. Política de Transparência Comercial
                    </div>

                </div>

                <div id="markdown">
                    ${markdown}
                </div>

            </div>

        </div>
    `;

    return divMais;
}