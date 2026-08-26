export function obterDescricaoArtigo(html, limite = 200) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const primeiroParagrafo = doc.querySelector("p");

    if (!primeiroParagrafo) return "";

    let resultado = primeiroParagrafo.textContent.replace(/\s+/g, " ").trim();

    if (resultado.length > limite) {
        resultado = resultado.substring(0, limite).trim() + "...";
    }

    return resultado;
}