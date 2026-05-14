function iniciarHeader() {
    let itens = document.querySelectorAll(".element-header");
    const savedTheme = localStorage.getItem("theme");

    itens.forEach(item => {
        item.addEventListener("click", function(){
            itens.forEach(i => i.classList.remove("ativo-header"));
            this.classList.add("ativo-header");
        });
    });

    // Dando função aos ícones
    let logo = document.getElementById("header-logo");
    let blog = document.getElementById("header-blog");
    let livros = document.getElementById("header-livros");
    let home = document.getElementById("header-home");
    let tema = document.getElementById("tema");

    let caminhoHome = "/";
    let caminhoBlog = "/blog";
    let caminhoLivros = "/livros";

    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = caminhoHome;
        });
    }

    if (home) {
        home.addEventListener("click", () => {
            window.location.href = caminhoHome;
        });
    }

    if (blog) {
        blog.addEventListener("click", () => {
            window.location.href = caminhoBlog;
        });
    }

    if (livros) {
        livros.addEventListener("click", () => {
            window.location.href = caminhoLivros;
        });
    }
}