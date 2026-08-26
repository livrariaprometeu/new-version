import { aplicarHeader } from '/assets/js/components/header.js';
import { aplicarFooter } from '/assets/js/components/footer.js';
import { criarSlug } from '/assets/js/utils/criar-slug.js';
import { criarCardLivro } from '/assets/js/utils/criar-card-livros.js';
import { configurarFiltros } from '/assets/js/utils/filtros.js';
import { configurarBotaoMais, configurarBotaoLer } from '/assets/js/utils/botoes.js';

aplicarHeader();

let todosLivros = []; // cache dos livros carregados

async function carregarLivros() {
    const res = await fetch('/api/livros');
    if (!res.ok) throw new Error(`Erro ao carregar livros: ${res.status}`);
    return await res.json();
}

function renderizarLivros(livros) {
    const container = document.getElementById("lista-livros");
    container.replaceChildren();

    livros.forEach(livro => {
        const slugCategoria = criarSlug(livro.categorias[0].nome);
        const slugLivro = criarSlug(livro.titulo, livro.idiomas[0].codigo);
        const caminho = `${slugCategoria}/${slugLivro}`;

        const card = criarCardLivro(livro, caminho);
        container.appendChild(card);

        configurarBotaoLer(card.querySelector(".ler-livro"), livro, `/livros/${caminho}`);
        configurarBotaoMais(card.querySelector(".mais-livro"), livro, `/livros/${caminho}`);
    });
}

function aplicarFiltros({ texto = "", estrelas = 0 }) {
    const termo = texto.trim().toLowerCase();

    const filtrados = todosLivros.filter(livro => {
        const bateTexto = !termo ||
            livro.titulo.toLowerCase().includes(termo) ||
            (livro.autor?.nome?.toLowerCase().includes(termo));

        const bateEstrelas = estrelas === 0 || (livro.avaliacao ?? 0) >= estrelas;

        return bateTexto && bateEstrelas;
    });

    renderizarLivros(filtrados);
}

async function iniciar() {
    try {
        todosLivros = await carregarLivros();
        renderizarLivros(todosLivros);
    } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
    }
}

configurarFiltros(aplicarFiltros); // filtros.js chama isso a cada mudança
iniciar();
aplicarFooter();