import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const getDiasEntrega = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dias_entrega');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
