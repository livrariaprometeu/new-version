// função para ler arquivo .txt
async function lerArquivo(id) {
  try {
    const response = await fetch(`data/resumo/${id}.md`);
    const texto = await response.text();
    return texto;
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

function compartilhar(titulo, id) {
  if (navigator.share) {
    navigator.share({
      title: `${titulo}`,
      text: "\nTô te enviando esse eBook, achei a sua cara 😄\n",
      url: `/livros/data/?id=${id}`
    });
  } else {
    alert("Compartilhamento não suportado nesse navegador.");
  }
}

// 1) Utiliza .json para fazer o layout dos livros
fetch("data/livros.json")
  .then(res => res.json())
  .then(dados => {
        const container = document.getElementById("lista-livros");

        // Seleciona os dados do livro (Un.)
        dados.forEach(item => {
            const div = document.createElement("div");

            // 2) Transforma nota de 1 a 5 em estrelas
            let nota = item.avaliacao
            let html = "";
            for (let i = 1; i <= 5; i++) {
            if (i <= nota) {
                html += "★";
            } else {
                html += "☆";
            }
            }

            div.classList.add("card");

            // 3) Define o layout do card
            div.innerHTML = `
                <div id="container-livro">
                    <div id="idioma-livro">${item.idioma}</div>
                    <div class="capa-livro"><img class="capa-livro" src="/livros/data/capa/${item.id}.webp"></div>
                    <p id="titulo-livro">${item.titulo}</p>
                    <div id="informacoes-livro">
                        <p class="informacao-livro" id="categoria-livro">${item.categoria}</p>
                        <p class="informacao-livro" id="categoria-estrelas">${html}</p>
                    </div>
                    <p class="ler-livro" id="ler-livro">Ler</p>
                    <p class="mais-livro" id="mais-livro">Mais</p>
                </div>
            `;
            
            console.log(`img src="/livros/data/capa/${item.id}.webp`)

            // Adiciona localizadores
            div.setAttribute("data-avaliacao", item.avaliacao); // Avaliação
            div.classList.add("card", "livro"); // Geral

            container.appendChild(div);

            // 4) Da funcionalidade para os botões do container
            // 4.1) Funcionalidade para o botão "Mais"
            const btnLer = div.querySelector(".ler-livro");
            let caminhoLer = "/livros/data/";

            btnLer.addEventListener("click", () => {
                 window.location.href = `${caminhoLer}?id=${item.id}`;
            });
            // 4.2) Funcionalidade para o botão "Mais"
            // Define variáveis
            const btnMais = div.querySelector(".mais-livro");
            const aba = document.getElementById("aba");
            const conteudoMais = document.getElementById("conteudo-mais")
            
            btnMais.addEventListener("click", () => {
            if (aba.style.display === "none") {
                conteudoMais.innerHTML = "";
                const divMais = document.createElement("div");
            
                divMais.classList.add("card");

                let texto = lerArquivo(item.id).then(texto => {
                    let markdown = marked.parse(texto);
                    
                    // Define layout do card
                    divMais.innerHTML = `
                        <div>
                            <div class="mais-livro" id="fechar-mais">x</div>
                            <div id="corpo-mais">
                                <div id="markdown-resumo-livro">${markdown}</div>
                                <div id="btns-resumo-livro">
                                    <p class="btn-resumo-livro ler-livro" id="ler-livro-resumo">Ler</p>
                                    <p class="btn-resumo-livro" id="compartilhar-livro-resumo">Compartilhar</p>
                                </div>
                            </div>
                        </div>
                    `;
                // 5) Da funcionalidade para os botões do "Ler Mais"
                // 5.1) Botão "x"
                const btnX = divMais.querySelector("#fechar-mais");
                btnX.addEventListener("click", () => {
                    aba.style.display = "none";
                });
                // 5.2) Botão "Ler"
                const btnLer = divMais.querySelector("#ler-livro-resumo");
                btnLer.addEventListener("click", () => {
                    window.location.href =  `${caminhoLer}?id=${item.id}`;
                });
                // 5.3) Botão "Compartilhar"
                const btnCompartilhar = divMais.querySelector("#compartilhar-livro-resumo");
                btnCompartilhar.addEventListener("click", () => {
                    compartilhar(item.title, item.id)
                });
                });

                conteudoMais.appendChild(divMais)
                aba.style.display = "block";
            } else {
                aba.style.display = "none";
                        
            }});
        });
    });

// 7) Adiciona filtros
function filtrarLivros() {
    const textoBusca = document.getElementById("pesquisa").value.toLowerCase();
    const livros = document.querySelectorAll(".livro");

    livros.forEach(livro => {
        const texto = livro.innerText.toLowerCase();
        const avaliacao = parseInt(livro.getAttribute("data-avaliacao"));

        // 🔍 filtro de texto
        const matchTexto = texto.includes(textoBusca);

        // ⭐ filtro de estrelas
        const matchEstrelas = valorFiltroEstrela === 0 || avaliacao >= valorFiltroEstrela ;

        // ✅ combinação dos filtros
        if (matchTexto && matchEstrelas) {
            livro.style.display = "block";
        } else {
            livro.style.display = "none";
        }
    });
}

document.getElementById("pesquisa").addEventListener("input", filtrarLivros);
const estrelas = document.querySelectorAll(".estrela");

let valorFiltroEstrela = 0;

// 🔁 função pra atualizar visual
function atualizarVisual(valor) {
    estrelas.forEach(e => {
        const v = parseInt(e.getAttribute("data-valor"));
        e.innerText = v <= valor ? "★" : "☆";
    });
}

estrelas.forEach(estrela => {
    // 🖱️ HOVER (pré-visualização)
    estrela.addEventListener("mouseover", () => {
        const valor = parseInt(estrela.getAttribute("data-valor"));
        atualizarVisual(valor);
    });

    // 🖱️ SAIU DO HOVER → volta pro valor real
    estrela.addEventListener("mouseout", () => {
        atualizarVisual(valorFiltroEstrela);
    });

    estrela.addEventListener("click", () => {
        const valor = parseInt(estrela.getAttribute("data-valor"));

        // Se clicar na mesma estrela → resetar
        if (valorFiltroEstrela === valor) {
            valorFiltroEstrela = 0;
        } else {
            valorFiltroEstrela = valor;
        }

        // Atualiza visual
        estrelas.forEach(e => {
            const v = parseInt(e.getAttribute("data-valor"));
            e.innerText = v <= valorFiltroEstrela ? "★" : "☆";
        });

        // 🔥 aqui você pode chamar seu filtro geral
        filtrarLivros();
    });
});