import { Router } from 'express';
import { poolPromise } from '../db.js';
const router = Router();

router.get('/', async (_req, res, next) => {
  try { const pool = await poolPromise; const r = await pool.request().query('SELECT * FROM Orders'); res.json(r.recordset); }
  catch(e){ next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const { id, value_rs, route_id, delivery_time } = req.body;
    const pool = await poolPromise;
    await pool.request().input('id', id).input('v', value_rs).input('r', route_id).input('t', delivery_time)
      .query('INSERT INTO Orders (id, value_rs, route_id, delivery_time) VALUES (@id,@v,@r,@t)');
    const r = await pool.request().input('id', id).query('SELECT * FROM Orders WHERE id=@id');
    res.status(201).json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const { value_rs, route_id, delivery_time } = req.body;
    const pool = await poolPromise;
    await pool.request().input('id', req.params.id).input('v', value_rs).input('r', route_id).input('t', delivery_time)
      .query('UPDATE Orders SET value_rs=@v, route_id=@r, delivery_time=@t WHERE id=@id');
    const r = await pool.request().input('id', req.params.id).query('SELECT * FROM Orders WHERE id=@id');
    res.json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try { const pool = await poolPromise; await pool.request().input('id', req.params.id).query('DELETE FROM Orders WHERE id=@id'); res.json({ ok: true }); }
  catch(e){ next(e); }
});

export default router;
