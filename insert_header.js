fetch("/header/index.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;

        if (typeof iniciarHeader === "function") {
            iniciarHeader();
        }

        // 🔥 AQUI sim funciona
        const path = window.location.pathname;

        let idAtivo = "header-home"; // padrão (else)

        if (path.includes("blog")) {
            idAtivo = "header-blog";
        } else if (path.includes("livros")) {
            idAtivo = "header-livros";
        }

        document.getElementById(idAtivo)?.classList.add("ativo-header");
    });