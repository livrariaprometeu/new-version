async function buscarNoJSON(caminhoJSON, termoBusca) {
  try {
    const response = await fetch(caminhoJSON);
    const data = await response.json();

    const termo = termoBusca.toLowerCase();

    function buscaRecursiva(obj) {
      if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
        return obj.toString().toLowerCase().includes(termo);
      }

      if (Array.isArray(obj)) {
        return obj.some(item => buscaRecursiva(item));
      }

      if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).some(valor => buscaRecursiva(valor));
      }

      return false;
    }

    // Se for array de itens (mais comum)
    if (Array.isArray(data)) {
      return data.filter(item => buscaRecursiva(item));
    }

    // Se for objeto único
    if (buscaRecursiva(data)) {
      return data;
    }

    return [];
  } catch (erro) {
    console.error("Erro ao buscar no JSON:", erro);
    return [];
  }
}