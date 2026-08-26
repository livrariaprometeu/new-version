import { lerArquivoMd } from '/assets/js/utils/ler-arquivo-md.js'

// =============================
// 
// 
// CONFIGURAÇÃO DO BOTÃO "LER"
// 
// 
// =============================



export function configurarBotaoLer(btnLer, item, caminho) {
    btnLer.addEventListener("click", () => {
        window.location.href = `${caminho}`
    });
}



// =============================
// 
// 
// CONFIGURAÇÃO DO BOTÃO "MAIS"
// 
// 
// =============================



function abrirAbaMais(aba) {
    aba.style.display = "block";
}


async function criarConteudoMais(caminho, conteudoMais) {
    conteudoMais.innerHTML = "";

    const divMais = document.createElement("div");
    divMais.classList.add("card");

    const texto = await lerArquivoMd(`${caminho}/resumo.md`);
    const markdown = marked.parse(texto);

    divMais.innerHTML = `
        <div class="container-mais">
            <div class="mais-livro" id="fechar-mais">x</div>

            <div id="corpo-mais">
                <div id="markdown-resumo-livro">
                    ${markdown}
                </div>

                <div id="btns-resumo-livro">
                    <p class="btn-resumo-livro ler-livro ler-livro-resumo" id="ler-livro-resumo">
                        Ler
                    </p>

                    <p class="btn-resumo-livro" id="compartilhar-livro-resumo">
                        Compartilhar
                    </p>
                </div>
            </div>
        </div>
    `;

    conteudoMais.appendChild(divMais);

    return divMais;
}


function configurarBotaoFecharMais(divMais, aba) {
    const btnX = divMais.querySelector("#fechar-mais");

    btnX.addEventListener("click", () => {
        aba.style.display = "none";
    });
}


export function configurarBotaoMais(btnMais, item, caminho) {
    const aba = document.getElementById("aba");
    const conteudoMais = document.getElementById("conteudo-mais");

    btnMais.addEventListener("click", async () => {

        abrirAbaMais(aba);

        const divMais = await criarConteudoMais(
            caminho,
            conteudoMais
        );

        configurarBotaoFecharMais(
            divMais,
            aba
        );


        // Botão Ler
        const btnLer = aba.querySelector(".ler-livro");

        configurarBotaoLer(
            btnLer,
            item,
            caminho
        );


        // Botão Compartilhar
        const btnCompartilhar = aba.querySelector("#compartilhar-livro-resumo");

        configurarBotaoCompartilhar(
            btnCompartilhar,
            item,
            caminho
        );
    });
}



// =============================
// 
// 
// CONFIGURAÇÃO DO BOTÃO "COMPARTILHAR"
// 
// 
// =============================



export async function compartilhar(titulo, caminho) {
    if (!navigator.share) {
        alert("Compartilhamento não suportado nesse navegador.");
        return;
    }

    try {
        await navigator.share({
            title: titulo,
            text: `Te enviando o eBook "${titulo}" porque acho que você vai gostar.

                    É uma leitura rápida e pode te trazer boas ideias sobre esse tema.

                    Se quiser, dá uma olhada aqui 👇`,
            url: `https://livrariaprometeu.com/${caminho}`
        });
    } catch (erro) {
        // O usuário pode simplesmente ter cancelado o compartilhamento.
        if (erro.name !== "AbortError") {
            console.error("Erro ao compartilhar:", erro);
        }
    }
}


export function configurarBotaoCompartilhar(
    btnCompartilhar,
    titulo,
    caminho
) {
    btnCompartilhar.addEventListener("click", () => {
        compartilhar(titulo, caminho);
    });
}