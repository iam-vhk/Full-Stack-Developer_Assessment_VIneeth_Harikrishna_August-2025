/**
 * Run simulation over rows pulled from MSSQL.
 * @param {Object} input { driversAvailable, routeStartTime, maxHoursPerDriver }
 * @param {Array} orders MSSQL rows: { id, value_rs, route_id, delivery_time }
 * @param {Array} drivers MSSQL rows: { id, name, shift_hours, past_week_hours }
 * @param {Map<number,route>} routesById: { id, distance_km, traffic_level, base_time_min }
 */
export function runSimulation(input, orders, drivers, routesById) {
  const { driversAvailable, routeStartTime, maxHoursPerDriver } = input;
  if (driversAvailable <= 0) throw Object.assign(new Error('driversAvailable must be > 0'), { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(routeStartTime)) throw Object.assign(new Error('routeStartTime must be HH:MM'), { status: 400 });
  if (maxHoursPerDriver <= 0) throw Object.assign(new Error('maxHoursPerDriver must be > 0'), { status: 400 });

  const active = drivers.slice(0, driversAvailable);
  if (!active.length) return zero();

  let idx = 0;
  let totalProfit = 0, onTime = 0, late = 0, fuelCost = 0, bonusTotal = 0, penaltyTotal = 0;

  for (const o of orders) {
    const d = active[idx % active.length]; idx++;
    const r = routesById.get(o.route_id);
    if (!r) continue;

    const lastDay = (d.past_week_hours || '').toString().split('|').filter(Boolean).map(Number).slice(-1)[0] || 0;
    const fatigueMul = lastDay > 8 ? 1.3 : 1.0;
    const actualMin = r.base_time_min * fatigueMul;
    const limit = r.base_time_min + 10;
    const isOnTime = actualMin <= limit;

    const perKm = 5 + (r.traffic_level === 'High' ? 2 : 0);
    const thisFuel = perKm * r.distance_km;
    fuelCost += thisFuel;

    let bonus = 0, penalty = 0;
    if (!isOnTime) penalty += 50;
    if (o.value_rs > 1000 && isOnTime) bonus += o.value_rs * 0.10;

    bonusTotal += bonus; penaltyTotal += penalty;
    const profit = o.value_rs + bonus - penalty - thisFuel;
    totalProfit += profit;

    if (isOnTime) onTime++; else late++;
  }

  const efficiencyScore = (onTime + late) ? (onTime / (onTime + late)) * 100 : 0;
  return { totalProfit, efficiencyScore, onTime, late, fuelCost, bonusTotal, penaltyTotal };
}

function zero(){ return { totalProfit:0, efficiencyScore:0, onTime:0, late:0, fuelCost:0, bonusTotal:0, penaltyTotal:0 }; }
