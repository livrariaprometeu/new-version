export async function lerArquivoMd(caminho) {
  try {
    const response = await fetch(`${caminho}`); 
    const texto = await response.text();
    return texto;
  } catch (erro) {
    console.error('Erro:', erro);
  }
}