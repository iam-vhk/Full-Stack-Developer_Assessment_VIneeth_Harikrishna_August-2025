import { Router } from 'express';
import { poolPromise } from '../db.js';
import { runSimulation } from '../services/simulationService.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { driversAvailable, routeStartTime, maxHoursPerDriver } = req.body;
    if (driversAvailable == null || routeStartTime == null || maxHoursPerDriver == null) {
      return res.status(400).json({ error: true, message: 'driversAvailable, routeStartTime, maxHoursPerDriver are required' });
    }
    const pool = await poolPromise;
    const [orders, drivers, routes] = await Promise.all([
      pool.request().query('SELECT * FROM Orders'),
      pool.request().query('SELECT * FROM Drivers'),
      pool.request().query('SELECT * FROM Routes')
    ]);
    const routesById = new Map(routes.recordset.map(r => [r.id, r]));
    const kpis = runSimulation({ driversAvailable, routeStartTime, maxHoursPerDriver }, orders.recordset, drivers.recordset, routesById);
    await pool.request()
      .input('da', driversAvailable)
      .input('st', routeStartTime)
      .input('mh', maxHoursPerDriver)
      .input('tp', kpis.totalProfit)
      .input('es', kpis.efficiencyScore)
      .input('ot', kpis.onTime)
      .input('lt', kpis.late)
      .input('fc', kpis.fuelCost)
      .input('bt', kpis.bonusTotal)
      .input('pt', kpis.penaltyTotal)
      .query(`INSERT INTO SimulationResults (drivers_available, route_start_time, max_hours_per_driver, total_profit, efficiency_score, on_time, late, fuel_cost, bonus_total, penalty_total)
              VALUES (@da,@st,@mh,@tp,@es,@ot,@lt,@fc,@bt,@pt)`);
    res.json({ kpis });
  } catch(e){ next(e); }
});

router.get('/history', async (_req, res, next) => {
  try {
    const pool = await poolPromise;
    const r = await pool.request().query('SELECT TOP 50 * FROM SimulationResults ORDER BY created_at DESC');
    res.json(r.recordset);
  } catch(e){ next(e); }
});

export default router;
