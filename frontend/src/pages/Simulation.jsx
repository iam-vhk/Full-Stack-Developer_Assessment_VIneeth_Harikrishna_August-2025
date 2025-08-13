import { useState } from 'react';
import api from '../api.js';

export default function Simulation(){
  const [driversAvailable,setDriversAvailable] = useState(3);
  const [routeStartTime,setRouteStartTime] = useState('09:00');
  const [maxHoursPerDriver,setMaxHoursPerDriver] = useState(8);
  const [result,setResult] = useState(null);
  const [err,setErr] = useState('');

  const run = async e => {
    e.preventDefault(); setErr('');
    try {
      const { data } = await api.post('/simulate', { driversAvailable:Number(driversAvailable), routeStartTime, maxHoursPerDriver:Number(maxHoursPerDriver) });
      setResult(data);
    } catch (e) { setErr(e?.response?.data?.message || 'Simulation failed'); }
  };

  return (
    <div style={{padding:24,display:'grid',gap:16}}>
      <h2>Simulation</h2>
      <form onSubmit={run} style={{display:'grid',gap:12,maxWidth:480}}>
        <label>Drivers Available <input type="number" value={driversAvailable} onChange={e=>setDriversAvailable(e.target.value)} /></label>
        <label>Route Start Time <input placeholder="HH:MM" value={routeStartTime} onChange={e=>setRouteStartTime(e.target.value)} /></label>
        <label>Max Hours/Driver <input type="number" value={maxHoursPerDriver} onChange={e=>setMaxHoursPerDriver(e.target.value)} /></label>
        {err && <div style={{color:'red'}}>{err}</div>}
        <button>Run Simulation</button>
      </form>
      {result && (<div style={{marginTop:16}}><pre style={{background:'#fafafa',padding:12,borderRadius:8}}>{JSON.stringify(result.kpis, null, 2)}</pre></div>)}
    </div>
  );
}
