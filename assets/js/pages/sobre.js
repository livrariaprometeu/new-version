import { aplicarHeader } from '/assets/js/components/header.js';
import { aplicarFooter } from '/assets/js/components/footer.js';

import { lerArquivoMd } from '/assets/js/utils/ler-arquivo-md.js';
import { criarContainerSobre } from '/assets/js/utils/criar-container-sobre.js';
import { obterCaminho } from '/assets/js/utils/rota.js';

import { 
    configurarMenuSobre,
    marcarItemAtivo
} from '/assets/js/components/menu-sobre.js';



const caminho = obterCaminho();

aplicarHeader();

async function carregarResumo(
    caminhoMd = "/sobre/nos/texto.md"
) {

    const conteudoMais = document.getElementById("texto-principal");

    if (!conteudoMais) {
        console.error("Elemento #texto-principal não encontrado!");
        return;
    }

    try {

        const texto = await lerArquivoMd(`${caminhoMd}`);

        if (texto === null) {
            return;
        }

        const divMais = criarContainerSobre(texto, caminhoMd);

        conteudoMais.appendChild(divMais);

        configurarMenuSobre(divMais);

        marcarItemAtivo(divMais, caminhoMd);

    } catch (erro) {

        console.error("Erro ao carregar resumo:", erro);

    }
}

console.log(caminho)
if (caminho.caminho !== "sobre") {
    carregarResumo(`/sobre/${caminho.caminho}/texto.md`);
} else {
    carregarResumo(`/sobre/nos/texto.md`);
}

aplicarFooter();