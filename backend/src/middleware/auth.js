import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: true, message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: true, message: 'Invalid token' });
  }
};
