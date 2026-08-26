// api/artigos-total.js
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

  const { cluster, autor } = req.query;

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

  // COUNT(DISTINCT a.id) porque os JOINs com autores podem multiplicar linhas
  // (um artigo com 2 autores geraria 2 linhas sem o DISTINCT)
  const query = `
    SELECT COUNT(DISTINCT a.id) AS total
    FROM artigos a
    LEFT JOIN artigos_autores aa ON aa.artigo_id = a.id
    LEFT JOIN autores au ON au.id = aa.autor_id
    ${whereClause}
  `;

  try {
    const { rows } = await pool.query(query, values);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ total: parseInt(rows[0].total, 10) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao contar artigos' });
  }
}