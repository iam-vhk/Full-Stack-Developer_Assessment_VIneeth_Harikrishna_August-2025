import { Router } from 'express';
import { poolPromise } from '../db.js';
const router = Router();

router.get('/', async (req, res, next) => {
  try { const pool = await poolPromise; const r = await pool.request().query('SELECT * FROM Drivers'); res.json(r.recordset); }
  catch(e){ next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const { name, shift_hours=0, past_week_hours='' } = req.body;
    const pool = await poolPromise;
    const r = await pool.request().input('name', name).input('s', shift_hours).input('p', past_week_hours)
      .query('INSERT INTO Drivers (name, shift_hours, past_week_hours) OUTPUT INSERTED.* VALUES (@name,@s,@p)');
    res.status(201).json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const { name, shift_hours, past_week_hours } = req.body;
    const pool = await poolPromise;
    await pool.request().input('id', req.params.id).input('name', name).input('s', shift_hours).input('p', past_week_hours)
      .query('UPDATE Drivers SET name=@name, shift_hours=@s, past_week_hours=@p WHERE id=@id');
    const r = await pool.request().input('id', req.params.id).query('SELECT * FROM Drivers WHERE id=@id');
    res.json(r.recordset[0]);
  } catch(e){ next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try { const pool = await poolPromise; await pool.request().input('id', req.params.id).query('DELETE FROM Drivers WHERE id=@id'); res.json({ ok: true }); }
  catch(e){ next(e); }
});

export default router;
