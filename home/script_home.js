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
const slides = document.querySelectorAll(".card");
const indicadores = document.querySelector(".indicadores");

slides.forEach((_, index) => {
    const dot = document.createElement("span");

    dot.classList.add("dot");

    if(index === 0){
        dot.classList.add("ativo");
    }

    indicadores.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

carrossel.addEventListener("scroll", () => {
    const indice = Math.round(
        carrossel.scrollLeft / carrossel.offsetWidth
    );

    dots.forEach(dot => dot.classList.remove("ativo"));
    dots[indice]?.classList.add("ativo");
});