import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { limit, offset, cluster, autor } = req.query;

  const conditions = [];
  const values = [];

  if (cluster) {
    values.push(cluster);
    conditions.push(`a.cluster = $${values.length}`);
  }

  if (autor) {
    values.push(autor);
    conditions.push(`au.id = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let limitClause = '';
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      values.push(parsedLimit);
      limitClause = `LIMIT $${values.length}`;
    }
  }

  let offsetClause = '';
  if (offset) {
    const parsedOffset = parseInt(offset, 10);
    if (!Number.isNaN(parsedOffset) && parsedOffset >= 0) {
      values.push(parsedOffset);
      offsetClause = `OFFSET $${values.length}`;
    }
  }

  const query = `
    SELECT 
      a.id, a.titulo, a.slug, a.avaliacao_prometeu, a.cluster, a.data_publicacao,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', c.id, 'nome', c.nome))
        FILTER (WHERE c.id IS NOT NULL), '[]'
      ) AS categorias,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', i.id, 'nome', i.nome, 'codigo', i.codigo))
        FILTER (WHERE i.id IS NOT NULL), '[]'
      ) AS idiomas,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', au.id, 'nome', au.nome_fantasia))
        FILTER (WHERE au.id IS NOT NULL), '[]'
      ) AS autores
    FROM artigos a
    LEFT JOIN artigos_categorias ac ON ac.artigo_id = a.id
    LEFT JOIN categorias c ON c.id = ac.categoria_id
    LEFT JOIN artigos_idiomas ai ON ai.artigo_id = a.id
    LEFT JOIN idiomas i ON i.id = ai.idioma_id
    LEFT JOIN artigos_autores aa ON aa.artigo_id = a.id
    LEFT JOIN autores au ON au.id = aa.autor_id
    ${whereClause}
    GROUP BY a.id
    ORDER BY a.data_publicacao DESC
    ${limitClause}
    ${offsetClause}
  `;

  try {
    const { rows } = await pool.query(query, values);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar artigos' });
  }
}