import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const getCamionesDias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM camiones_dias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClientesAsignados = async (req, res) => {
  try {
    const { camion_dia } = req.params;
    const result = await pool.query('SELECT * FROM camion_dias_entrega WHERE camion_dia = $1', [camion_dia]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
