async function carregarArtigo(id) {
  try {
    // Caminho do arquivo .txt no mesmo domínio (funciona em site estático)
    const response = await fetch(`https://livrariaprometeu.com/blog/blog/article_content/${id}.txt`);
    if (!response.ok) throw new Error("Artigo não encontrado");

    const texto = await response.text();
    const html = converterParaHTML(texto);

    const container = document.getElementById("artigoContainer");
    container.innerHTML = html;
  } catch (erro) {
    console.error(erro);
    document.getElementById("artigoContainer").innerHTML =
      "<p>Não foi possível carregar este artigo.</p>";
  }
}

// Converte texto simples em HTML com formatação básica
function converterParaHTML(texto) {
  return texto
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n(?=\<li\>)/g, "<ul>")
    .replace(/(<\/li>)(?!\s*<li>)/g, "$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^([^<].*)$/gim, "<p>$1</p>");
}
