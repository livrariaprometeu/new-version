console.log("importado")
// 1) Utiliza .json para fazer o layout dos livros
fetch("/blog/data/artigos.json")
  .then(res => res.json())
  .then(dados => {
        const container = document.getElementById("lista-artigos");

        // Seleciona os dados do livro (Un.)
        dados.forEach(item => {
            let texto = lerArquivo(item.id).then(texto => {
                let markdown = marked.parse(texto);
                const div = document.createElement("div");
                div.classList.add("card");

                // 3) Define o layout do card
                div.innerHTML = `
                    <div id="container-artigo">
                        <div id="idioma-artigo">${item.idioma}</div>
                        <div class="capa-artigo"><img class="capa-artigo" src="/blog/data/artigo/${item.caminho}/capa.webp"></div>
                        <div id="infos-artigo">
                            <p id="titulo-artigo">${item.titulo}</p>
                            <div id="informacoes-artigo">
                                <p class="informacao-artigo" id="categoria-livro">${markdown}</p>
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
                let caminhoLer = "/blog/data/";

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