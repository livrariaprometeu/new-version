export function criarSlug(...parametros) {
    return parametros
        .filter(parametro => parametro != null && parametro !== "")
        .map(parametro =>
            String(parametro)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .filter(parametro => parametro !== "")
        .join("-");
}