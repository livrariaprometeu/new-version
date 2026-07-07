function obterDescricao(html, limite = 200) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const primeiroParagrafo = doc.querySelector("p");

    if (!primeiroParagrafo) return "";

    let resultado = primeiroParagrafo.textContent.replace(/\s+/g, " ").trim();

    if (resultado.length > limite) {
        resultado = resultado.substring(0, limite).trim() + "...";
    }

    return resultado;
}

// 1) Utiliza .json para fazer o layout dos livros
fetch("/blog/artigos.json")
  .then(res => res.json())
  .then(dados => {
        const container = document.getElementById("lista-artigos");

        // Seleciona os dados do artigo (Un.)
        dados.forEach(item => {
            
            let caminhoArtigo = item.titulo
                            .normalize("NFD")
                            .toLowerCase()
                            .replace(/[\u0300-\u036f]/g, "") // remove acentos
                            .replace(/[.,!?;:]/g, "") // remove pontuação
                            .trim()
                            .replace(/\s+/g, "-"); // troca espaços por "-"

            let caminhoMd = `artigo/${caminhoArtigo}/texto.md`

            fetch(caminhoMd)
                .then(res => res.text())
                .then(texto => {
                    let markdown = marked.parse(texto);
                    
                    let descricaoArtigo = obterDescricao(markdown);

                    const div = document.createElement("div");
                    div.classList.add("card");

                    // 3) Define o layout do card
                    div.innerHTML = `
                        <div id="container-artigo">
                            <div id="idioma-artigo">${item.idioma}</div>
                            <div class="capa-artigo"><img class="capa-artigo" src="/blog/artigo/${item.caminho}/capa.webp"></div>
                            <div id="infos-artigo">
                                <p id="titulo-artigo">${item.titulo}</p>
                                <div id="informacoes-artigo">
                                    <p class="informacao-artigo" id="categoria-livro">${descricaoArtigo}</p>
                                </div>
                            </div>
                        </div>
                    `;                    

                // Adiciona localizador
                div.classList.add("card", "artigo");

                container.appendChild(div);
            
                // 4) Da funcionalidade para os botões do container
                // 4.1) Funcionalidade para o botão "Mais"
                const btnLer = div.querySelector("#container-artigo");
                let caminhoLer = "/blog/";

                // 5) Da a possibilidade de buscar os elementos criados
                const inputPesquisa = document.getElementById("pesquisa");

                inputPesquisa.addEventListener("input", () => {
                    const valor = inputPesquisa.value.toLowerCase();

                    const artigos = document.querySelectorAll(".artigo");

                    artigos.forEach(artigo => {
                        const texto = artigo.innerText.toLowerCase();

                        if (texto.includes(valor)) {
                            artigo.style.display = "block";
                            encontrou = true
                        } else {
                            artigo.style.display = "none";
                        }
                    });
                    if (encontrou) {
                        mensagem.style.display = "none";
                    } else {
                        mensagem.style.display = "block";
                    }
                });

            btnLer.addEventListener("click", () => {
                 window.location.href = `${caminhoLer}artigo/${item.caminho}`;
                });
            
            });

        });
    });