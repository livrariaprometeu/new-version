export function sortearNumero(max) {
    const agora = Date.now();

    const sorteioSalvo = localStorage.getItem("sorteio");

    if (sorteioSalvo) {
        const dados = JSON.parse(sorteioSalvo);

        // Ainda está dentro das 24 horas
        if (agora < dados.expiraEm) {
            return dados.numero;
        }
    }

    // Novo sorteio
    const numero = Math.floor(Math.random() * (max + 1));

    const dados = {
        numero: numero,
        expiraEm: agora + 24 * 60 * 60 * 1000
    };

    localStorage.setItem("sorteio", JSON.stringify(dados));

    return numero;
}