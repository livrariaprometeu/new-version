export function obterCaminho() {

    const partes = window.location.pathname
        .split("/")
        .filter(Boolean);

    return {
        partes,
        caminhoCompleto: "/" + partes.join("/"),
        caminho: partes.at(-1)
    };
}