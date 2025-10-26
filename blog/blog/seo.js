/* ====================================================
   carregarArtigoSEO.js
   Responsável por:
   1. Carregar artigo de .txt
   2. Carregar hero, SEO dinâmico e JSON-LD via JSON
   ==================================================== */

/* ========== CARREGAMENTO DO TEXTO ========== */
async function carregarArtigo(id) {
  try {
    const response = await fetch(`https://livrariaprometeu.com/blog/blog/article_content/${id}.txt`);
    if (!response.ok) throw new Error("Artigo não encontrado");

    const texto = await response.text();
    const html = converterParaHTML(texto);

    document.getElementById("artigoContainer").innerHTML = html;
  } catch (erro) {
    console.error(erro);
    document.getElementById("artigoContainer").innerHTML = "<p>Não foi possível carregar este artigo.</p>";
  }
}

/* Converte texto simples em HTML com formatação básica */
function converterParaHTML(texto) {
  return texto
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n(?=\<li\>)/g, "<ul>")
    .replace(/(<\/li>)(?!\s*<li>)/g, "$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^([^<].*)$/gim, "<p>$1</p>")
    .replace(/\[botao:(.*?)\]\((.*?)\)/gim, `<a href="$2" target="_blank" class="botao-artigo">$1</a>`);
}

/* ========== CARREGAMENTO DO SEO E HERO ========== */
async function carregarSEO(id) {
  try {
    const res = await fetch("https://livrariaprometeu.com/blog/artigos.json");
    const data = await res.json();
    const artigo = data.articles.find(a => a.id === id);
    if (!artigo) return;

    // Hero
    if (artigo.hero) {
      const heroEl = document.getElementById("heroImage");
      if (heroEl) {
        heroEl.innerHTML = `
          <img
            src="${artigo.hero}"
            srcset="
              ${artigo.hero} 372w,
              ${artigo.hero} 744w,
              ${artigo.hero} 1240w
            "
            sizes="(max-width: 480px) 372px, (max-width: 900px) 744px, 1240px"
            alt="${artigo.title}"
          >
        `;
      }
    }

    // Título dinâmico
    document.title = artigo.title || document.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = artigo.summary || "";

    // JSON-LD dinâmico
    const scriptJsonLd = document.createElement("script");
    scriptJsonLd.type = "application/ld+json";
    scriptJsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": artigo.title,
      "description": artigo.summary,
      "image": artigo.hero,
      "author": {
        "@type": "Organization",
        "name": "Livraria Prometeu"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Livraria Prometeu",
        "logo": {
          "@type": "ImageObject",
          "url": "https://livrariaprometeu.com/03_MIDIA/logos/livraria_prometeu_original.webp"
        }
      },
      "datePublished": artigo.date,
      "articleSection": artigo.category,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    });
    document.head.appendChild(scriptJsonLd);

  } catch (err) {
    console.error("Erro ao carregar SEO:", err);
  }
}

/* ========== FUNÇÃO PARA CHAMAR AMBOS ========== */
function carregarArtigoESEO(id) {
  carregarArtigo(id);
  carregarSEO(id);
}

/* ========== EXPORTAÇÃO GLOBAL ========== */
window.carregarArtigo = carregarArtigo;
window.carregarSEO = carregarSEO;
window.carregarArtigoESEO = carregarArtigoESEO;