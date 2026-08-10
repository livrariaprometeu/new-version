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


async function carregarResumo(caminho_md = "/sobre/politica-de-transparencia-comercial/texto.md") {

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

        divMais.innerHTML = `
            <div class="definir-tamanho-aba">

                <div id="aba-sobre-geral">

                    <div id="menu-de-selecao-sobre">

                        <div class="item-menu-sobre" id="sobre">
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


function configurarMenuSobre(container) {

    const itensMenu = container.querySelectorAll(".item-menu-sobre");

    itensMenu.forEach(item => {

        item.addEventListener("click", async () => {

            // Remove o ativo de todos
            itensMenu.forEach(item => {
                item.classList.remove("ativo");
            });

            // Marca o item clicado
            item.classList.add("ativo");

            // ID do item
            const id = item.id;

            // Monta automaticamente o caminho
            const caminho = `/sobre/${id}/texto.md`;

            console.log("Carregando:", caminho);

            // Busca o Markdown
            const texto = await lerArquivoHome(caminho);

            if (texto === null) {
                return;
            }

            // Converte Markdown para HTML
            const markdown = marked.parse(texto);

            // Atualiza somente o conteúdo
            const areaMarkdown = container.querySelector("#markdown");

            if (areaMarkdown) {
                areaMarkdown.innerHTML = markdown;
            }

        });

    });

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


carregarResumo();