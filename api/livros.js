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

  const { limit, autor } = req.query;

  // Monta cláusulas dinamicamente, mas sempre com parâmetros ($1, $2...)
  // nunca concatenando o valor direto na string — evita SQL injection.
  const conditions = [];
  const values = [];

  if (autor) {
    values.push(autor);
    conditions.push(`a.id = $${values.length}`);
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

  const query = `
    SELECT 
      l.id, l.titulo, l.sinopse, l.link_afiliado, l.capa_url, l.criado_em,
      a.id AS autor_id, a.nome AS autor_nome,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', c.id, 'nome', c.nome))
        FILTER (WHERE c.id IS NOT NULL), '[]'
      ) AS categorias,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', i.id, 'nome', i.nome, 'codigo', i.codigo))
        FILTER (WHERE i.id IS NOT NULL), '[]'
      ) AS idiomas
    FROM livros l
    LEFT JOIN autores a ON a.id = l.autor_id
    LEFT JOIN livros_categorias lc ON lc.livro_id = l.id
    LEFT JOIN categorias c ON c.id = lc.categoria_id
    LEFT JOIN livros_idiomas li ON li.livro_id = l.id
    LEFT JOIN idiomas i ON i.id = li.idioma_id
    ${whereClause}
    GROUP BY l.id, a.id, a.nome
    ORDER BY l.titulo
    ${limitClause}
  `;

  try {
    const { rows } = await pool.query(query, values);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
}