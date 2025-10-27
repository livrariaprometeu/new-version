document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalCover = document.getElementById('modalCover');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalMeta = document.getElementById('modalMeta');
  const modalTags = document.getElementById('modalTags');
  const modalExcerpt = document.getElementById('modalExcerpt');
  const modalDownload = document.getElementById('modalDownload');
  const modalSave = document.getElementById('modalSave');
  const shareBtn = document.getElementById('shareBtn');
  const favoritesKey = 'prometeu_favs_v1';

  const ebookGrid = document.getElementById('ebookGrid');
  const loadMoreBtn = document.getElementById('loadMore');
  const searchInput = document.getElementById('q');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterChips = document.querySelectorAll('.chip');
  const featuredTitle = document.getElementById('featuredTitle');

  let ebooks = [];
  let shown = 0;
  const PAGE_SIZE = 9;
  let activeFilter = 'all';
  let searchTerm = '';

  function escapeHtml(s){ if(!s) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  function toast(msg){ const t = document.getElementById('toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',1600); }

  // FETCH EBOOKS
  fetch('https://livrariaprometeu.com/livros/ebooks.json')
    .then(r => r.json())
    .then(data => {
      ebooks = Array.isArray(data) ? data : (data.items||[]);
      document.getElementById('totalCount').textContent = ebooks.length;
      renderEbooks();
      restoreFavoritesUI();
    }).catch(err => {
      console.error('Erro ao carregar ebooks', err);
      ebookGrid.innerHTML = '<p style="color:var(--muted)">Erro ao carregar a coleção.</p>';
    });

  // FAVORITOS
  function getFavs(){ try{ return JSON.parse(localStorage.getItem(favoritesKey)||'[]'); }catch{return [];} }
  function saveFavs(arr){ localStorage.setItem(favoritesKey, JSON.stringify(arr)); }
  function toggleFavorite(e){
    const favs = getFavs();
    const idx = favs.findIndex(f=>f.id===e.id);
    if(idx>-1){ favs.splice(idx,1); toast('Removido dos favoritos'); }
    else { favs.unshift({id:e.id, title:e.titulo||'', cover:e.capa||''}); toast('Adicionado aos favoritos'); }
    saveFavs(favs);
    restoreFavoritesUI();
    updateModalSaveState(e);
  }
  function restoreFavoritesUI(){
    const wrap = document.getElementById('favList');
    const favs = getFavs();
    if(!favs.length){ wrap.textContent='Nenhum ainda — salve capas que gostar.'; return; }
    wrap.innerHTML = favs.slice(0,6).map(f=>`<div style="display:inline-block;margin-right:8px"><img src="${f.cover||'https://via.placeholder.com/34x50?text=Sem+Capa'}" alt="${escapeHtml(f.title)}" style="width:34px;height:50px;object-fit:cover;border-radius:4px"></div>`).join('');
  }

  // MODAL
  function openModal(e){
    if(!e) return;
    modalCover.innerHTML = `<img src="${e.capa||'https://via.placeholder.com/150x220?text=Sem+Capa'}" alt="${escapeHtml(e.titulo||'Sem título')}">`;
    modalTitle.textContent = e.titulo||'Título não disponível';
    modalAuthor.textContent = e.autor||'';
    modalMeta.textContent = `${e.categoria||'-'} • ${e.idioma||'-'} • ${e.tamanho||'-'}`;
    modalTags.innerHTML = (e.tags && e.tags.length) ? e.tags.map(t=>`<span class="chip">${t}</span>`).join('') : '';
    modalExcerpt.innerHTML = e.descricao ? `<em>${escapeHtml(e.descricao)}</em>` : '<div class="micro">Sem trecho disponível</div>';
    modalDownload.href = e.arquivo?.url || e.linkAmazon || '#';
    modalDownload.textContent = (e.arquivo?.url) ? 'Ler' : (e.linkAmazon?'Comprar na Amazon':'Indisponível');
    modalSave.onclick = ()=>{ toggleFavorite(e); };
    updateModalSaveState(e);
    shareBtn.onclick = ()=>{
      const url = e.arquivo?.url||e.linkAmazon||window.location.href;
      if(navigator.share) navigator.share({title:e.titulo||'', text:e.descricao||'', url}).catch(()=>{});
      else navigator.clipboard.writeText(url).then(()=>toast('Link copiado')).catch(()=>{});
    };
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    featuredTitle.textContent = e.titulo||'';
  }
  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', ev=>{ if(ev.target.id==='modal') closeModal(); });
  document.addEventListener('keydown', ev=>{ if(ev.key==='Escape') closeModal(); });

  function updateModalSaveState(e){
    const favs = getFavs();
    modalSave.textContent = favs.find(f=>f.id===e.id)?'Remover':'Salvar';
  }

  // FILTRO + PESQUISA INTEGRADOS
  function getFilteredEbooks(){
    return ebooks.filter(e=>{
      const matchFilter = activeFilter==='all' || (e.categoria||'').toLowerCase().includes(activeFilter.toLowerCase());
      const matchSearch = (e.titulo||'').toLowerCase().includes(searchTerm.toLowerCase()) || (e.autor||'').toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  // RENDER
  function renderEbooks(){
    ebookGrid.innerHTML='';
    shown=0;
    loadMoreEbooks();
  }

  function loadMoreEbooks(){
    const filtered = getFilteredEbooks();
    const items = filtered.slice(shown, shown+PAGE_SIZE);
    items.forEach(e=>{
      const div = document.createElement('div');
      div.className='card';
      div.innerHTML = `<img src="${e.capa||'https://via.placeholder.com/120x180?text=Sem+Capa'}" alt="${escapeHtml(e.titulo||'')}" loading="lazy">
        <h3>${escapeHtml(e.titulo||'')}</h3>
        <p class="micro">${escapeHtml(e.autor||'')}</p>`;
      div.addEventListener('click', ()=>openModal(e));
      ebookGrid.appendChild(div);
    });
    shown += items.length;
    loadMoreBtn.style.display = (shown < filtered.length) ? 'inline-block' : 'none';
  }

  // EVENTOS
  filterChips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      filterChips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      renderEbooks();
    });
  });

  searchInput.addEventListener('input', ()=>{
    searchTerm = searchInput.value;
    renderEbooks();
  });
  clearSearchBtn.addEventListener('click', ()=>{
    searchTerm='';
    searchInput.value='';
    renderEbooks();
  });

  loadMoreBtn.addEventListener('click', loadMoreEbooks);
});