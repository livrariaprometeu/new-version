// seo.js
async function carregarArtigoESEO(id) {
  try {
    // 1. Carrega o conteúdo do artigo (.txt)
    const response = await fetch(`https://livrariaprometeu.com/blog/blog/article_content/${id}.txt`);
    if (!response.ok) throw new Error("Artigo não encontrado");
    const texto = await response.text();
    document.getElementById("artigoContainer").innerHTML = converterParaHTML(texto);

    // 2. Carrega o JSON com os dados do artigo
    const resJson = await fetch("https://livrariaprometeu.com/blog/artigos.json");
    const data = await resJson.json();
    const artigo = data.find(a => a.id === id);
    if (!artigo) return;

    // 3. Hero (imagem principal)
    if (artigo.hero) {
      document.getElementById("heroImage").innerHTML = `
        <img src="${artigo.hero}" alt="${artigo.title}"/>
      `;
      document.getElementById("heroImage").setAttribute("aria-hidden", "false");
    }

    // 4. SEO: título dinâmico
    document.title = artigo.title || document.title;

    // 5. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = artigo.summary || "";

    // 6. JSON-LD dinâmico
    const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) existingJsonLd.remove();

    const scriptJsonLd = document.createElement("script");
    scriptJsonLd.type = "application/ld+json";
    scriptJsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": artigo.title,
      "description": artigo.summary,
      "image": artigo.hero || artigo.cover || "",
      "author": { "@type": "Organization", "name": "Livraria Prometeu" },
      "publisher": {
        "@type": "Organization",
        "name": "Livraria Prometeu",
        "logo": { "@type": "ImageObject", "url": "https://livrariaprometeu.com/03_MIDIA/logos/livraria_prometeu_original.webp" }
      },
      "datePublished": artigo.date || new Date().toISOString(),
      "articleSection": artigo.category,
      "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href }
    });
    document.head.appendChild(scriptJsonLd);

  } catch (err) {
    console.error("Erro ao carregar artigo/SEO:", err);
    document.getElementById("artigoContainer").innerHTML = "<p>Não foi possível carregar este artigo.</p>";
  }
}

// Função auxiliar para converter o txt em HTML
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