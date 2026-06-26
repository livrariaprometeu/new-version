// Descobre qual foi a aba carregada grava em uma variável
const partes = window.location.pathname.split('/').filter(Boolean);
const caminhoCompleto = '/'+partes.join('/');
const caminho = partes.slice(-1).join('/');

// tranforma o nome da aba de "aba-exemplo" para "Aba Exemplo"
let nomeAutorLower = caminho.replaceAll("-", " ");
let nomeAutor = nomeAutorLower
    .split(" ")
    .map(nomeAutorLower => nomeAutorLower.charAt(0).toUpperCase() + nomeAutorLower.slice(1))
    .join(" ");


// Adiciona o cabeçalho com Titulo + Livros + Capa
async function carregarCabecalho(AbaArtigo) {
  const conteudoImg = document.getElementById("img-autor");  // Seleciona o ID a ser modificado
  
  // Trata erro
  if (!conteudoImg) {
    console.error("Elemento não encontrado!");
    return;
  }

  // Cria uma div
  const divImg = document.createElement("div");
  divImg.classList.add("cabecalho-img");

  // Adiciona elementos na div 
  try {
    divImg.innerHTML = `
      <div class="cabecalho-autor">
        <div id="apresentacao-livros-autor">
            <h1 id="titulo-autor">${nomeAutor}</h1>
            <p id="chamada-para-livros">Livros de ${nomeAutor} disponíveis na Livraria Prometeu:</p>
            <div id="lista-livros" class="carrossel-livros"></div>
        </div>
        <img id="capa-autor" src="${caminhoCompleto}/capa.webp"/>
      </div>
    `;

    conteudoImg.appendChild(divImg);

    return nomeAutor

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

carregarCabecalho(caminho); // Chama função para adicionar Markdown no HTML


async function carregarLivros(filtro, maxLivros) {
    const resposta = await fetch("/livros/data/livros.json");
    const dados = await resposta.json();

    const container = document.getElementById("lista-livros");

    if (!container) {
        console.error("Container #lista-livros não encontrado");
        return;
    }

    // Condicional se houver filtro de autor
    const livrosAutor = (filtro !== null && filtro !== undefined)
      ? dados.filter(livro => livro.autor === nomeAutor)
      : dados;

    const livrosExibidos = livrosAutor.slice(0, maxLivros);

    livrosExibidos.forEach(item => {
        const div = document.createElement("div");

        div.classList.add("card-livro-destaque");

        div.innerHTML = `
            <div id="container-livro">
                <a href="/livros/${item.caminho}">
                    <img class="capa-livro"
                         src="/livros/${item.caminho}/capa.webp"
                         alt="${item.titulo}">
                </a>
            </div>
        `;

        container.appendChild(div);
    });
}

carregarLivros(nomeAutor, 20);

// Lê o arquivo Markdown
async function lerArquivoHome(caminhoCompleto) {
  try {
    const response = await fetch(`${caminhoCompleto}/texto.md`);

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
async function carregarResumo(caminhoCompleto) {
  const conteudoMais = document.getElementById("texto-principal");

  if (!conteudoMais) {
    console.error("Elemento não encontrado!");
    return;
  }

  const divMais = document.createElement("div");
  divMais.classList.add("card");

  try {
    const texto = await lerArquivoHome(caminhoCompleto);

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

carregarResumo(caminhoCompleto); // Chama função para adicionar Markdown no HTML

async function criarRecomendacoesArtigos(nomeAutor) {
    try {
        const response = await fetch("/blog/artigos.json");
        const artigos = await response.json();

        // Embaralha um array
        const embaralhar = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        // Artigos do autor
        let recomendados = artigos.filter(
            artigo => artigo.autor === nomeAutor
        );

        recomendados = embaralhar(recomendados);

        // Se tiver menos de 3, completa com aleatórios
        if (recomendados.length < 3) {
            const faltam = 3 - recomendados.length;

            const outrosArtigos = artigos.filter(
                artigo =>
                    artigo.autor !== nomeAutor &&
                    !recomendados.some(r => r.id === artigo.id)
            );

            recomendados.push(
                ...embaralhar(outrosArtigos).slice(0, faltam)
            );
        }

        // Garante no máximo 3
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
                                src="/blog/artigo/${artigo.caminho}/capa.webp">
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
                window.location.href = `/blog/artigo/${caminho}`;
            });
        });

    } catch (erro) {
        console.error("Erro ao carregar recomendações:", erro);
    }
}

criarRecomendacoesArtigos(nomeAutor);