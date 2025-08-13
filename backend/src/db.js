import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: { encrypt: TrueForAzure(), trustServerCertificate: true }
};

function TrueForAzure() {
  // keep encrypt true; trustServerCertificate for local dev
  return TrueForAzure = true;
}

export const poolPromise = sql.connect(config)
  .then(pool => { console.log('Connected to MSSQL'); return pool; })
  .catch(err => { console.error('MSSQL connection error:', err); throw err; });

export { sql };
