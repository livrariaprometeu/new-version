// função para ler arquivo .txt
async function lerArquivo(caminho) {
  try {
    const response = await fetch(`/blog/artigo/${caminho}/resumo.md`);
    const texto = await response.text();
    return texto;
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

function criarIndicadores(qtd) {
  const container = document.getElementById("indicadores");
  container.innerHTML = "";

  for (let i = 0; i < qtd; i++) {
    const bolinha = document.createElement("div");
    bolinha.classList.add("bolinha");

    if (i === 0) bolinha.classList.add("ativa");

    container.appendChild(bolinha);
  }
}

function atualizarIndicadores(index) {
  const bolinhas = document.querySelectorAll(".bolinha");

  bolinhas.forEach((b, i) => {
    b.classList.toggle("ativa", i === index);
  });
}

function gerarSeedDoDia() {
  const hoje = new Date();
  return hoje.getFullYear() + "-" + hoje.getMonth() + "-" + hoje.getDate();
}

function embaralharComSeed(array, seed) {
  let arr = [...array];

  let random = mulberry32(hashCode(seed));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h;
}

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function pegar3Artigos(dados) {
  const seed = gerarSeedDoDia();
  const embaralhado = embaralharComSeed(dados, seed);
  return embaralhado.slice(0, 3);
}

async function renderizarTrack(lista) {
  const track = document.getElementById("track-destaque");
  track.innerHTML = "";

  for (let item of lista) {
   const texto = await lerArquivo(item.caminho); 
    const markdown = marked.parse(texto);

    const div = document.createElement("div");
    div.classList.add("card-destaque");

    urlCapa = `/blog/artigo/${item.caminho}/capa.webp`
    div.innerHTML = `
      <div class="capa-artigo-container">
        <img class="capa-destaque" src="${urlCapa}">
        <div class="container-artigo-destaque">
          <div class="idioma-artigo-destaque">${item.idioma}</div>
          <p class="titulo-artigo-destaque">${item.titulo}</p>
          <p class="conteudo-artigo-destaque">${markdown}</p>
        </div>
      </div>
    `;
    div.addEventListener("click", () => {
      window.location.href = `/blog/artigo/${item.caminho}`;
    });

    track.appendChild(div);
  }
}

fetch("/blog/artigos.json")
  .then(res => res.json())
  .then(async (dados) => {

    const selecionados = pegar3Artigos(dados);

    await renderizarTrack(selecionados);

    criarIndicadores(selecionados.length);

    const track = document.getElementById("track-destaque");

    let index = 0;

    function slide() {
      index = (index + 1) % selecionados.length;

      track.style.transform = `translateX(-${index * 100}%)`;

      atualizarIndicadores(index);
    }

    setInterval(slide, 5000);
  });