import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const termo = (req.query.q || '').trim();

  if (!termo) {
    return res.status(400).json({ erro: 'Parâmetro "q" é obrigatório' });
  }

  try {
    const { rows } = await sql`
      SELECT
        id, titulo, autor, categoria, slug,
        GREATEST(
          similarity(titulo, ${termo}),
          similarity(autor, ${termo}),
          similarity(categoria, ${termo})
        ) AS relevancia
      FROM artigos
      WHERE
        titulo % ${termo}
        OR autor % ${termo}
        OR categoria % ${termo}
      ORDER BY relevancia DESC
      LIMIT 20
    `;

    res.status(200).json(rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao pesquisar artigos' });
  }
}