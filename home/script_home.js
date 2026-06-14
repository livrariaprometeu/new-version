async function lerArquivoHome(arquivo) {
  try {
    const response = await fetch(`/home/data/${arquivo}.md`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.text();

  } catch (erro) {
    console.error('Erro ao buscar arquivo:', erro);
  }
}

async function carregarResumo() {
  const conteudoMais = document.getElementById("texto-principal");

  if (!conteudoMais) {
    console.error("Elemento não encontrado!");
    return;
  }

  const divMais = document.createElement("div");
  divMais.classList.add("card");

  try {
    const texto = await lerArquivoHome("resumo_prometeu");

    console.log("Texto carregado:", texto);

    const markdown = marked.parse(texto);

    divMais.innerHTML = `
      <div id="markdown-resumo-livro">${markdown}</div>
      <a class="links" href="/sobre" rel="noopener noreferrer">
        <div id="btn-resumo-home">Saiba mais</div>
      </a>
    `;

    conteudoMais.appendChild(divMais);

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

carregarResumo();

// CARROSSEL
const carrossel = document.getElementById("carrossel");
const cards = document.querySelectorAll(".card-carrossel");
const dots = document.querySelectorAll(".dot");

const btnPrev = document.querySelector(".seta-esquerda");
const btnNext = document.querySelector(".seta-direita");

let index = 0;

function atualizarDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle("ativo", i === index);
    });
}

function irParaSlide(i) {
    index = i;

    const cardWidth = carrossel.clientWidth;

    carrossel.scrollTo({
        left: cardWidth * index,
        behavior: "smooth"
    });

    atualizarDots();
}
btnNext.addEventListener("click", () => {
    if (index < cards.length - 1) {
        irParaSlide(index + 1);
    } else {
        irParaSlide(0);
    }
});

btnPrev.addEventListener("click", () => {
    if (index > 0) {
        irParaSlide(index - 1);
    } else {
        irParaSlide(cards.length - 1);
    }
});

carrossel.addEventListener("scroll", () => {
    const indexCalc = Math.round(carrossel.scrollLeft / carrossel.clientWidth);
    index = indexCalc;
    atualizarDots();
});