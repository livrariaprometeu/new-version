export async function calcularTotalArtigos(itensPorPagina = 6, cluster = null) {
  const params = new URLSearchParams();
  if (cluster) params.append('cluster', cluster);

  const res = await fetch(`/api/artigos-total?${params.toString()}`);
  const { total } = await res.json();

  return total;
}