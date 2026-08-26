export async function criarCabecalho(autor, caminho_completo) {
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
            <h1 id="titulo-autor">${autor.nome}</h1>
            <p id="chamada-para-livros">Livros de ${autor.nome} disponíveis na Livraria Prometeu:</p>
            <div id="lista-livros" class="lista-livros carrossel-livros"></div>
        </div>
        <img id="capa-autor" src="https://livrariaprometeu.com${caminho_completo}/capa.webp"/>
      </div>
      <div id="sobre-autor"></div>
    `;

    conteudoImg.appendChild(divImg); 
  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

function criarItem(titulo, valor) {
    if (!valor) return "";

    return `
    <div class="autor-autor">
        <div class="topicoSobre">${titulo}</div>
        <div class="valorSobre">${valor}</div>
    </div>
    `;
}

export async function sobreAutor(autor) {
  const conteudo = document.getElementById("sobre-autor");  // Seleciona o ID a ser modificado
  
  // Trata erro
  if (!conteudo) {
    console.error("Elemento não encontrado!");
    return;
  }

  // Cria uma div
  const divSobre = document.createElement("div");
  divSobre.classList.add("div-sobre-autor");

  // Adiciona elementos na div 
  try {
    divSobre.innerHTML = `
            <div id="container-sobre-autor">
              <div id="vidaContainer">
                <div class="vida" id="vida-nascimento">
                  <div class="topicoSobre" id="nascimento">Nascimento</div>
                  <div class="dataVida valorSobre">${autor.data_nascimento}</div>
                  <div class="valorSobre">${autor.local_nascimento}</div>
                </div>
                <div class="vida" id="vida-falecimento">
                  <div class="topicoSobre" id="falecimento">Falecimento</div>
                  <div class="dataVida valorSobre">${autor.data_falecimento}</div>
                  <div class="valorSobre">${autor.local_falecimento}</div>
                </div>
              </div>
              <div class="container-sobre-autor">
                ${criarItem("Nome Completo", autor.nome_completo)}
                ${criarItem("Pseudônimo", autor.pseudonimo)}
                ${criarItem("Nacionalidade", autor.nacionalidade)}
                ${criarItem("Ocupação", autor.ocupacao)}
                ${criarItem("Educação", autor.educacao)}
                ${criarItem("Cônjuge", autor.conjuge)}
                ${criarItem("Filhos", autor.filhos)}
                ${criarItem("Religião", autor.religiao)}
                ${criarItem("Gêneros Literários", autor.generos)}
                ${criarItem("Movimento Literário", autor.movimento)}
                ${criarItem("Influências", autor.influencias)}
                ${criarItem("Obra Mais Famosa", autor.obra_mais_famosa)}
                ${criarItem("Período de Atividade", autor.periodo_atividade)}
                ${criarItem("Idade", autor.idade)}
              </div>
            </div>
        `;

    conteudo.appendChild(divSobre);
 
  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}