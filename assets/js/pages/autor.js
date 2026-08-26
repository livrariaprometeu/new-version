// ====================================
// 
//             REFATORAR
// 
// ====================================



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

async function criarRecomendacoesArtigos(nomeAutor) {
    try {
        const response = await fetch("/blog/artigos.json");
        const artigos = await response.json();

        // Embaralha um array
        const embaralhar = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        // Artigos do autor
        let recomendados = artigos.filter(
            artigo => artigo.sobreAutor === nomeAutor
        );

        recomendados = embaralhar(recomendados);

        // Se tiver menos de 3, completa com aleatórios
        if (recomendados.length < 3) {
            const faltam = 3 - recomendados.length;

            const outrosArtigos = artigos.filter(
                artigo =>
                    artigo.sobreAutor !== nomeAutor &&
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

async function carregarGaleria(maxImg, containerGaleriaDeclarado, dados, caminhoCompleto) {

    const containerGaleria = document.getElementById(containerGaleriaDeclarado);

    if (!containerGaleria) {
        console.error(`Container ${containerGaleria} não encontrado`);
        return;
    }

    const fotosExibidos = dados.slice(0, maxImg);

    for (const item of fotosExibidos) {
        if (!item) continue;

        const img = new Image();
        img.src = `${caminhoCompleto}/${item}`;
      
        await new Promise(resolve => {
            img.onload = () => {
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



// ====================================
// 
//           JÁ REFATORADO
// 
// ====================================



import { aplicarHeader } from '/assets/js/components/header.js';
import { aplicarFooter } from '/assets/js/components/footer.js';


import { lerArquivoMd } from '/assets/js/utils/ler-arquivo-md.js';
import { obterCaminho } from '/assets/js/utils/rota.js';


import { 
    carregarFotoPrincipal 
} from '/assets/js/utils/exibir-imagens.js';
import { 
    criarCabecalho,
    sobreAutor
} from '/assets/js/components/conteudo-default-autor.js';


async function carregarAutor(slug) {
    const res = await fetch(`/api/slug-autor?slug=${slug}`);

    if (!res.ok) {
        throw new Error(`Erro ao carregar livros: ${res.status}`);
    }

    return await res.json();
}


async function exibirTexto(texto) {
  const markdown = marked.parse(texto);

  const conteudo = document.getElementById("texto-principal");  // Seleciona o ID a ser modificado

  // Trata erro
  if (!conteudo) {
    console.error("Elemento não encontrado!");
    return;
  }

  // Cria uma div
  const divSobre = document.createElement("div");
  divSobre.classList.add("card");

  // Adiciona elementos na div 
  try {
    divSobre.innerHTML = `
      <div class="definir-tamanho-aba">
        <div id="markdown">${markdown}</div>
      </div>
    `;

    conteudo.appendChild(divSobre);
 
  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}


async function iniciar() {
    aplicarHeader();

    const caminho = obterCaminho();
    
    const slug = caminho.caminho;
    const caminho_completo = caminho.caminhoCompleto;

    const autor = await carregarAutor(slug);


    await criarCabecalho(autor[0], caminho_completo);
    await sobreAutor(autor[0]);

    const texto = await lerArquivoMd(`${caminho_completo}/texto.md`);
    if (!texto) {
        console.error("Markdown não encontrado!");
        return;
    } else {
        exibirTexto(texto);
    }

    carregarFotoPrincipal(1, "img-inicio-artigo", ["img/capa.webp"], caminho_completo);


    await carregarLivros(autor[0].nome, 20, "lista-livros");
    await carregarLivros(autor[0].nome, 20, "lista-livros-md");
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
                            caminho_completo);
    await inicializarModalGaleria();
    criarRecomendacoesArtigos(autor[0].nome)

    aplicarFooter();
}

iniciar();