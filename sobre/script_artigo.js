// Descobre qual foi a aba carregada grava em uma variável
const partes = window.location.pathname.split('/').filter(Boolean);
const caminhoCompleto = '/'+partes.join('/');
const caminho = partes.slice(-1).join('/');

console.log("CAMINHO COMPLETO", caminhoCompleto)
console.log("CAMINHO", caminho)

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

function configurarMenuSobre(container) {

    const itensMenu = container.querySelectorAll(".item-menu-sobre");

    const toggle = container.querySelector("#menu-sobre-mobile-toggle");
    const menu = container.querySelector("#menu-de-selecao-sobre");
    const titulo = container.querySelector("#menu-sobre-mobile-titulo");


    // Botão do menu mobile
    if (toggle && menu) {

        toggle.addEventListener("click", function () {

            toggle.classList.toggle("aberto");
            menu.classList.toggle("aberto");

        });

    }


    itensMenu.forEach(item => {

        item.addEventListener("click", async function () {

            // Remove ativo
            itensMenu.forEach(outroItem => {
                outroItem.classList.remove("ativo");
            });


            // Adiciona ativo
            item.classList.add("ativo");


            // Atualiza o título do botão mobile
            if (titulo) {
                titulo.textContent = item.textContent.trim();
            }


            // Fecha o menu
            if (toggle && menu) {
                toggle.classList.remove("aberto");
                menu.classList.remove("aberto");
            }


            // ID do item
            const id = item.id;

            // Caminho do Markdown
            const caminho = `/sobre/${id}/texto.md`;

            console.log("Carregando:", caminho);


            // Busca Markdown
            const texto = await lerArquivoHome(caminho);

            if (texto === null) {
                return;
            }


            // Converte Markdown
            const markdown = marked.parse(texto);


            // Atualiza conteúdo
            const areaMarkdown = container.querySelector("#markdown");

            if (areaMarkdown) {
                areaMarkdown.innerHTML = markdown;
            }

        });

    });
}

function marcarItemAtivo(container, caminho_md) {

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


async function lerArquivoHome(caminho_md) {
    try {
        const response = await fetch(caminho_md);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.text();

    } catch (erro) {
        console.error("Erro ao buscar arquivo:", erro);
        return null;
    }
}


async function carregarResumo(caminho_md = "/sobre/nos/texto.md") {

    const conteudoMais = document.getElementById("texto-principal");

    if (!conteudoMais) {
        console.error("Elemento #texto-principal não encontrado!");
        return;
    }

    const divMais = document.createElement("div");
    divMais.classList.add("card");

    try {

        const texto = await lerArquivoHome(caminho_md);

        if (texto === null) {
            return;
        }

        console.log("Texto carregado:", texto);

        const markdown = marked.parse(texto);

        textoMenu = tratamentoCaminho(caminho)

        divMais.innerHTML = `
            <div class="definir-tamanho-aba">

                <div id="aba-sobre-geral">

                <div id="menu-sobre-mobile-toggle">
                    <span id="menu-sobre-mobile-titulo">${textoMenu}</span>
                    <span id="menu-sobre-mobile-seta">⌄</span>
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

        conteudoMais.appendChild(divMais);

        configurarMenuSobre(divMais);

        // Marca o item correspondente ao arquivo carregado
        marcarItemAtivo(divMais, caminho_md);

    } catch (erro) {

        console.error("Erro ao carregar resumo:", erro);

    }
}


function marcarItemAtivo(container, caminho_md) {

    // Extrai a pasta do caminho
    const partes = caminho_md.split("/");

    // Exemplo:
    // /sobre/1-sobre/texto.md
    //
    // partes:
    // ["", "sobre", "1-sobre", "texto.md"]

    const id = partes[2];

    const item = container.querySelector(`#${CSS.escape(id)}`);

    if (item) {
        item.classList.add("ativo");
    }

}



if (caminho !== "sobre") {
    carregarResumo(`/sobre/${caminho}/texto.md`);
} else {
    carregarResumo(`/sobre/nos/texto.md`);
}