import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const models = await sql`SELECT * FROM models ORDER BY created_at DESC`;
      return res.status(200).json(models);
    }

    if (req.method === 'POST') {
      const { name, age, city, photo_url, video_url, status } = req.body;
      const result = await sql`
        INSERT INTO models (name, age, city, photo_url, video_url, status)
        VALUES (${name}, ${age}, ${city}, ${photo_url}, ${video_url}, ${status || 'online'})
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      await sql`DELETE FROM models WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
