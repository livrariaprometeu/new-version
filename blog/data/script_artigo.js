// Descobre qual foi o artigo carregado grava em uma variável
const partes = window.location.pathname.split('/').filter(Boolean);
const resultado = partes.slice(-1).join('/');

console.log(resultado);

// Lê o arquivo Markdown
async function lerArquivoHome(AbaArtigo) {
  try {
    const response = await fetch(`/blog/data/artigo/${AbaArtigo}/texto.md`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.text();

  } catch (erro) {
    console.error('Erro ao buscar arquivo:', erro);
    return null;
  }
}

// Adiciona arquivo Markdown na pagina HTML
async function carregarResumo(AbaArtigo) {
  const conteudoMais = document.getElementById("texto-principal");

  if (!conteudoMais) {
    console.error("Elemento não encontrado!");
    return;
  }

  const divMais = document.createElement("div");
  divMais.classList.add("card");

  try {
    const texto = await lerArquivoHome(AbaArtigo);

    const markdown = marked.parse(texto);

    divMais.innerHTML = `
      <div class="definir-tamanho-aba">
        <div id="markdown">${markdown}</div>
      </div>
    `;

    conteudoMais.appendChild(divMais);

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

carregarResumo(resultado); // Chama função para adicionar Markdown no HTML



async function criarRecomendacoes(caminhoAtual) {
    try {
        const response = await fetch("/blog/data/artigos.json");
        const artigos = await response.json();

        const artigoAtual = artigos.find(
            artigo => artigo.caminho === caminhoAtual
        );

        if (!artigoAtual) return;

        const embaralhar = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        // Mesma categoria
        let recomendados = artigos.filter(
            artigo =>
                artigo.categoria === artigoAtual.categoria &&
                artigo.caminho !== caminhoAtual
        );

        recomendados = embaralhar(recomendados);

        // Completa até 3
        if (recomendados.length < 3) {
            const faltam = 3 - recomendados.length;

            const outrosArtigos = artigos.filter(
                artigo =>
                    artigo.caminho !== caminhoAtual &&
                    !recomendados.some(r => r.id === artigo.id)
            );

            recomendados.push(
                ...embaralhar(outrosArtigos).slice(0, faltam)
            );
        }

        recomendados = recomendados.slice(0, 3);

        document.getElementById("conteudo-pos-artigo").innerHTML = `
        <section class="recomendacoes">
            <h2>Artigos recomendados</h2>
            <div class="lista-recomendacoes">
                ${recomendados.map(artigo => `
                    <div class="container-artigo"
                        data-caminho="${artigo.caminho}">
                        
                        <div id="idioma-artigo">${artigo.idioma}</div>

                        <div class="capa-artigo">
                            <img class="capa-artigo"
                                src="/blog/data/artigo/${artigo.caminho}/capa.webp">
                        </div>

                        <div id="infos-artigo">
                            <p id="titulo-artigo">${artigo.titulo}</p>
                        </div>

                    </div>
                `).join("")}
            </div>
        </section>
        `;

        document.querySelectorAll(".container-artigo").forEach(card => {
            card.addEventListener("click", () => {
                const caminho = card.dataset.caminho;
                window.location.href = `/blog/data/artigo/${caminho}`;
            });
        });
    } catch (erro) {
        console.error("Erro ao carregar recomendações:", erro);
    }
}

criarRecomendacoes(resultado);