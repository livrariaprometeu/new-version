async function pesquisarApi(endpoint, parametros = {}) {
    const query = new URLSearchParams(parametros);

    const url = `${endpoint}?${query}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
}

async function utilizarHtmlSearch(caminho_api) {
    
}