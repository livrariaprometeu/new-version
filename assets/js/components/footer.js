function criarFooter() {
    const card = document.createElement("div");

    card.classList.add("card-livro-destaque");

    card.innerHTML = `
            <nav id="footer">
                <div id="right-footer">
                    <a href="/"><img id="logo-footer" src="/header/logo/livraria_prometeu_original.webp"></a>
                </div>
                
                <div id="div-container-footer"></div>

                <div id="redes-social">
                    <a class="links" href="https://www.facebook.com/profile.php?id=61568471436809&locale=pt_BR" target="_blank" rel="noopener noreferrer">
                        <div class="div-rede-social-un" id="facebook-footer">
                            <img src="/footer/img/facebook.webp" class="logo-footer" id="logo-f-footer">
                            <div>Livraria Prometeu</div>
                        </div>
                    </a>

                    <a class="links" href="https://www.instagram.com/livrariaprometeu" target="_blank" rel="noopener noreferrer">
                        <div class="div-rede-social-un" id="instagram-footer">
                            <img src="/footer/img/instagram.webp" class="logo-footer" id="logo-i-footer">
                            <div>@livrariaprometeu</div>    
                        </div>
                    </a>
                </div>
            </nav>
    `;

    return card;
}


export async function aplicarFooter() {
    const container = document.getElementById("footer-container");

    try {
        container.replaceChildren();

        const footer = criarFooter();

        container.appendChild(footer);

    } catch (erro) {
        console.error("Erro ao carregar destaque:", erro);
    }
}