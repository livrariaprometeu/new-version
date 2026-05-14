async function lerArquivoHome() {

  const caminhoMarkdown = new URL(
    "texto.md",
    window.location.href
  );

  console.log("Arquivo:", caminhoMarkdown.href);

  try {
    const response = await fetch(caminhoMarkdown);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.text();

  } catch (erro) {
    console.error('Erro ao buscar arquivo:', erro);
    return null;
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
    const texto = await lerArquivoHome();

    console.log("Texto carregado:", texto);

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

carregarResumo();