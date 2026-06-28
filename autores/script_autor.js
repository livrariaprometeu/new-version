// Descobre qual foi a aba carregada grava em uma variável
const partes = window.location.pathname.split('/').filter(Boolean);
const caminhoCompleto = '/'+partes.join('/');
const caminho = partes.slice(-1).join('/');

console.log("CAMINHO CONPLETO", caminhoCompleto)
console.log("CAMINHO", caminho)

// tranforma o nome da aba de "aba-exemplo" para "Aba Exemplo"
let nomeAutorLower = caminho.replaceAll("-", " ");
let nomeAutor = nomeAutorLower
    .split(" ")
    .map(nomeAutorLower => nomeAutorLower.charAt(0).toUpperCase() + nomeAutorLower.slice(1))
    .join(" ");


const JSONLoader = {
  async load(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ao acessar ${url}`);
    }

    return res.json();
  }
};

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
            <div id="lista-livros" class="lista-livros carrossel-livros"></div>
        </div>
        <img id="capa-autor" src="https://livrariaprometeu.com${caminhoCompleto}/capa.webp"/>
      </div>
      <div id="sobre-autor"></div>
    `;

    conteudoImg.appendChild(divImg);

    return nomeAutor

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}


async function carregarLivros(filtro, maxLivros, containerCarrosel) {
    const resposta = await fetch("/livros/data/livros.json");
    const dados = await resposta.json();

    const container = document.getElementById(containerCarrosel);

    if (!container) {
        console.error(`Container ${containerCarrosel} não encontrado`);
        return;
    }

    const livrosAutor = filtro
        ? dados.filter(livro => livro.autor === filtro)
        : dados;

    const livrosExibidos = livrosAutor.slice(0, maxLivros);

    livrosExibidos.forEach(item => {
        const div = document.createElement("div");

        div.classList.add("card-livro-destaque");

        div.innerHTML = `
            <div class="container-livro">
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

async function sobreAutor(nome) {
  try {
    const jsonAutores = await JSONLoader.load('/autores/data/autores.json');

    const jsonAutor = jsonAutores.filter(
      json => json.autor === nome
    );

    console.log('ESSE É DO AUTOR:', jsonAutor);

    const containerSobre = document.getElementById("sobre-autor");
    if (!containerSobre) {
        console.error("Container #lista-livros não encontrado");
        return;
    }

    function criarItem(titulo, valor) {
      if (!valor) return "";

      return `
        <div class="item-autor">
          <div class="topicoSobre">${titulo}</div>
          <div class="valorSobre">${valor}</div>
        </div>
      `;
    }

    jsonAutor.forEach(item => {
        const div = document.createElement("div");

        div.classList.add("card-livro-destaque");

        div.innerHTML = `
            <div id="container-sobre-autor">
              <div id="vidaContainer">
                <div class="vida" id="vida-nascimento">
                  <div class="topicoSobre" id="nascimento">Nascimento</div>
                  <div class="dataVida valorSobre">${item.dataNascimento}</div>
                  <div class="valorSobre">${item.localNascimento}</div>
                </div>
                <div class="vida" id="vida-falecimento">
                  <div class="topicoSobre" id="falecimento">Falecimento</div>
                  <div class="dataVida valorSobre">${item.dataFalecimento}</div>
                  <div class="valorSobre">${item.localFalecimento}</div>
                </div>
              </div>
              <div class="container-sobre-autor">
                ${criarItem("Nome Completo", item.nomeCompleto)}
                ${criarItem("Pseudônimo", item.pseudonimo)}
                ${criarItem("Nacionalidade", item.nacionalidade)}
                ${criarItem("Ocupação", item.ocupacao)}
                ${criarItem("Educação", item.educacao)}
                ${criarItem("Cônjuge", item.conjuge)}
                ${criarItem("Filhos", item.filhos)}
                ${criarItem("Religião", item.religiao)}
                ${criarItem("Gêneros Literários", item.generos)}
                ${criarItem("Movimento Literário", item.movimento)}
                ${criarItem("Influências", item.influencias)}
                ${criarItem("Obra Mais Famosa", item.obraFamosa)}
                ${criarItem("Período de Atividade", item.periodoAtividade)}
                ${criarItem("Idade", item.idade)}
              </div>
            </div>
        `;

      containerSobre.appendChild(div);
    });

  } catch (err) {
    console.error('Erro ao carregar autores:', err);
    return [];
  }
}

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
async function carregarMakdown(caminhoCompleto) {
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
    console.error("Erro ao carregar Markdown:", erro);
  }
}

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


async function carregarFotoPrincipal(maxImg, containerGaleriaDeclarado, dados, caminhoCompleto, caminho) {

    const containerGaleria = document.getElementById(containerGaleriaDeclarado);

    if (!containerGaleria) {
        console.error(`Container ${containerGaleria} não encontrado`);
        return;
    }

    const fotosExibidos = dados.slice(0, maxImg);

    console.log("CAMINHO DA CAPA",`${caminhoCompleto}/img/capa.webp`)
    for (const item of fotosExibidos) {
        if (!item) continue;

        const img = new Image();
        img.src = item;

        await new Promise(resolve => {
            img.onload = () => {
                const div = document.createElement("div");
                div.classList.add("card-foto-principal");

                div.innerHTML = `
                    <img class="inicio-artigo" src="${caminhoCompleto}/img/capa.webp">
                `;

                containerGaleria.appendChild(div);
                resolve();
            };

            img.onerror = () => {
                console.warn(`Imagem não encontrada: ${item}`);
                resolve();
            };
        });
    }
}

async function carregarGaleria(maxImg, containerGaleriaDeclarado, dados) {

    const containerGaleria = document.getElementById(containerGaleriaDeclarado);

    if (!containerGaleria) {
        console.error(`Container ${containerGaleria} não encontrado`);
        return;
    }

    const fotosExibidos = dados.slice(0, maxImg);

    for (const item of fotosExibidos) {
        if (!item) continue;

        const img = new Image();
        img.src = item;

        await new Promise(resolve => {
            img.onload = () => {
                console.log("CAMINHO DA GALERIA",`${caminhoCompleto}/${item}`)

                const div = document.createElement("div");
                div.classList.add("card-galeria-foto");

                div.innerHTML = `
                    <div class="container-galeria">
                        <img class="capa-galeria"
                            src="${caminhoCompleto}/${item}"
                            alt="foto galeria">
                    </div>
                `;

                containerGaleria.appendChild(div);
                resolve();
            };

            img.onerror = () => {
                console.warn(`Imagem não encontrada: ${item}`);
                resolve();
            };
        });
    }
}

function inicializarModalGaleria() {
    const modal = document.getElementById("modal-imagem");
    const imagemAmpliada = document.getElementById("imagem-ampliada");
    const fechar = document.getElementById("fechar-modal");

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("capa-galeria")) {
            imagemAmpliada.src = e.target.src;
            modal.classList.add("ativo");
        }
    });

    fechar.addEventListener("click", () => {
        modal.classList.remove("ativo");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("ativo");
        }
    });
}


// Flow de apesentação da pagina
async function init(caminhoCompleto, caminho) {
  await carregarCabecalho(caminho);

  await sobreAutor(nomeAutor);

  await carregarLivros(nomeAutor, 20, "lista-livros");

  await criarRecomendacoesArtigos(nomeAutor);

  await carregarMakdown(caminhoCompleto);

  await carregarFotoPrincipal(1, "img-inicio-artigo", ["img/capa.webp"], caminhoCompleto, caminho)

  await carregarLivros(nomeAutor, 20, "lista-livros-md");

  await carregarGaleria(20, 
                        "container-galeria", 
                        [
                          "img/1.webp",
                          "img/2.webp",
                          "img/3.webp",
                          "img/4.webp",
                          "img/5.webp",
                          "img/6.webp",
                          "img/7.webp",
                          "img/8.webp",
                          "img/9.webp",
                          "img/10.webp",
                          "img/11.webp",
                          "img/12.webp",
                          "img/13.webp",
                          "img/14.webp",
                          "img/15.webp",
                          "img/16.webp",
                          "img/17.webp",
                          "img/18.webp",
                          "img/19.webp",
                          "img/20.webp"
                        ],
                        caminhoCompleto);

  await inicializarModalGaleria();
}

init(caminhoCompleto, caminho);