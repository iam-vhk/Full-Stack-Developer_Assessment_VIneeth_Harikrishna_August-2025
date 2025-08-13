import { Router } from 'express';
import { poolPromise } from '../db.js';
const router = Router();

router.get('/', async (_req, res, next) => {
  try { const pool = await poolPromise; const r = await pool.request().query('SELECT * FROM Routes'); res.json(r.recordset); }
  catch(e){ next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const { id, distance_km, traffic_level, base_time_min } = req.body;
    const pool = await poolPromise;
    await pool.request().input('id', id).input('d', distance_km).input('t', traffic_level).input('b', base_time_min)
      .query('INSERT INTO Routes (id, distance_km, traffic_level, base_time_min) VALUES (@id,@d,@t,@b)');
    const r = await pool.request().input('id', id).query('SELECT * FROM Routes WHERE id=@id');
    res.status(201).json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const { distance_km, traffic_level, base_time_min } = req.body;
    const pool = await poolPromise;
    await pool.request().input('id', req.params.id).input('d', distance_km).input('t', traffic_level).input('b', base_time_min)
      .query('UPDATE Routes SET distance_km=@d, traffic_level=@t, base_time_min=@b WHERE id=@id');
    const r = await pool.request().input('id', req.params.id).query('SELECT * FROM Routes WHERE id=@id');
    res.json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try { const pool = await poolPromise; await pool.request().input('id', req.params.id).query('DELETE FROM Routes WHERE id=@id'); res.json({ ok: true }); }
  catch(e){ next(e); }
});

export default router;
