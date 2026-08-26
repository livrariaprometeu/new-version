import { aplicarHeader } from '/assets/js/components/header.js';
import { aplicarFooter } from '/assets/js/components/footer.js';


import { gerarDestaqueArtigo } from '/assets/js/components/destaque-artigos.js';
import { criarSlug } from '/assets/js/utils/criar-slug.js';
import { criarCardArtigo } from '/assets/js/utils/criar-card-artigos.js';



aplicarHeader();

gerarDestaqueArtigo();

async function carregarArtigosBlog() {
    const res = await fetch('/api/artigos');

    if (!res.ok) {
        throw new Error(`Erro ao carregar autores: ${res.status}`);
    }

    return await res.json();
}

async function criarContainerArtigos() {
    const container = document.getElementById("lista-artigos");

    try {
        const artigos = await carregarArtigosBlog();

        container.replaceChildren();

        artigos.forEach(async (artigo) => {
            const slug_artigo = criarSlug(artigo.titulo);

            const card = await criarCardArtigo(artigo, slug_artigo);
            container.appendChild(card);
        });
    
    } catch (erro) {
        console.error("Erro ao carregar destaque:", erro);
    }
}

criarContainerArtigos()

aplicarFooter();