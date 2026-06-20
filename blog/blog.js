const input = document.getElementById("search");
const lista = document.getElementById("resultados");

console.log("Importado")
input.addEventListener("input", async () => {
  const valor = input.value;

  const resultados = await buscarNoJSON("/blog/artigos.json", valor);

  // limpa resultados antigos
  lista.innerHTML = "";

  console.log(resultados);
  console.log(typeof resultados);

  // mostra novos resultados
  resultados.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - ${item.cidade}`;
    lista.appendChild(li);
  });
});