export async function carregarFotoPrincipal(maxImg, containerGaleriaDeclarado, dados, caminhoCompleto) {

    const containerGaleria = document.getElementById(containerGaleriaDeclarado);

    if (!containerGaleria) {
        console.error(`Container ${containerGaleria} não encontrado`);
        return;
    }

    const fotosExibidos = dados.slice(0, maxImg);

    console.log("CAMINHO DA CAPA",`${caminhoCompleto}/img/capa.webp`)
    for (const item of fotosExibidos) {
        if (!item) continue;

        const img = new Image();
        img.src = `${caminhoCompleto}/${item}`;

        await new Promise(resolve => {
            img.onload = () => {
                const div = document.createElement("div");
                div.classList.add("card-foto-principal");

                div.innerHTML = `
                    <img class="inicio-artigo" src="${caminhoCompleto}/img/capa.webp">
                `;

                containerGaleria.appendChild(div);
                resolve();
            };

            img.onerror = () => {
                console.warn(`Imagem não encontrada: ${item}`);
                resolve();
            };
        });
    }
}