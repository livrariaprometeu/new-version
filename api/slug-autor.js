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

  const { limit, id, nome, slug } = req.query;

  const conditions = [];
  const values = [];

  if (id) {
    values.push(id);
    conditions.push(`id = $${values.length}`);
  }

  if (nome) {
    values.push(`%${nome}%`);
    conditions.push(`nome_fantasia ILIKE $${values.length}`);
  }

  if (slug) {
    values.push(slug);
    conditions.push(`
      regexp_replace(
        lower(unaccent(nome_fantasia)),
        '[^a-z0-9]+', '-', 'g'
      ) = $${values.length}
    `);
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
    SELECT *
    FROM autores
    ${whereClause}
    ORDER BY nome_fantasia 
    ${limitClause}
  `;

  try {
    console.log('1 - Iniciando query');
    console.log('Query:', query);
    console.log('Values:', values);

    const { rows } = await pool.query(query, values);

    console.log('2 - Query terminou');
    console.log('Rows:', rows.length);

    res.setHeader(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=600'
    );

    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro PostgreSQL:', error);
    res.status(500).json({ error: 'Erro ao buscar autores' });
  }
}