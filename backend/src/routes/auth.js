import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { poolPromise } from '../db.js';
import { config } from '../config.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: true, message: 'email and password required' });
    const pool = await poolPromise;
    const exists = await pool.request().input('email', email).query('SELECT id FROM Users WHERE email=@email');
    if (exists.recordset.length) return res.status(409).json({ error: true, message: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    await pool.request().input('email', email).input('hash', hash)
      .query('INSERT INTO Users (email, password_hash) VALUES (@email, @hash)');
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: true, message: 'email and password required' });
    const pool = await poolPromise;
    const r = await pool.request().input('email', email).query('SELECT id, password_hash, role FROM Users WHERE email=@email');
    if (!r.recordset.length) return res.status(401).json({ error: true, message: 'Invalid credentials' });
    const user = r.recordset[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: true, message: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, email, role: user.role || 'manager' }, config.jwtSecret, { expiresIn: '2d' });
    res.json({ token });
  } catch (e) { next(e); }
});

export default router;
