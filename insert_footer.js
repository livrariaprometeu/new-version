fetch("/footer/index.html")
    .then(res_footer => res_footer.text())
    .then(data_footer => {
        document.getElementById("footer-container").innerHTML = data_footer;

        if (typeof iniciarFooter === "function") {
            iniciarFooter();
        }
    });