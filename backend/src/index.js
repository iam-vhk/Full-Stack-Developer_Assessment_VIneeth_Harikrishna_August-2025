import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import driverRoutes from './routes/drivers.js';
import routeRoutes from './routes/routeEntities.js';
import orderRoutes from './routes/orders.js';
import simulateRoutes from './routes/simulate.js';
import './db.js'; // initialize connection

const app = express();
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/simulate', simulateRoutes);
app.use(errorHandler);

app.listen(config.port, () => console.log(`API on :${config.port}`));
