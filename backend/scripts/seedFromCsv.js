import fs from 'fs';
import csv from 'csv-parser';
import { poolPromise } from '../src/db.js';

const readCsv = (path) => new Promise((resolve,reject) => {
  const rows=[];
  fs.createReadStream(path).pipe(csv())
    .on('data', r => rows.push(r))
    .on('end', () => resolve(rows))
    .on('error', reject);
});

(async () => {
  try {
    const pool = await poolPromise;
    const drivers = await readCsv('./data/drivers.csv');
    const routes  = await readCsv('./data/routes.csv');
    const orders  = await readCsv('./data/orders.csv');

    // Clear
    await pool.request().query('DELETE FROM Orders; DELETE FROM Routes; DELETE FROM Drivers;');

    // Insert Routes first (FK)
    for (const r of routes) {
      await pool.request()
        .input('id', Number(r.route_id))
        .input('distance_km', Number(r.distance_km))
        .input('traffic_level', r.traffic_level)
        .input('base_time_min', Number(r.base_time_min))
        .query('INSERT INTO Routes (id, distance_km, traffic_level, base_time_min) VALUES (@id,@distance_km,@traffic_level,@base_time_min)');
    }
    console.log(`Inserted ${routes.length} routes`);

    // Drivers
    for (const d of drivers) {
      await pool.request()
        .input('name', d.name)
        .input('shift_hours', Number(d.shift_hours))
        .input('past_week_hours', d.past_week_hours) // pipe-separated string
        .query('INSERT INTO Drivers (name, shift_hours, past_week_hours) VALUES (@name,@shift_hours,@past_week_hours)');
    }
    console.log(`Inserted ${drivers.length} drivers`);

    // Orders
    for (const o of orders) {
      await pool.request()
        .input('id', Number(o.order_id))
        .input('value_rs', Number(o.value_rs))
        .input('route_id', Number(o.route_id))
        .input('delivery_time', o.delivery_time) // HH:MM
        .query('INSERT INTO Orders (id, value_rs, route_id, delivery_time) VALUES (@id,@value_rs,@route_id,@delivery_time)');
    }
    console.log(`Inserted ${orders.length} orders`);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
