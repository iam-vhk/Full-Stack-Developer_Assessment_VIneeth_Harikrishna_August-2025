import { useEffect, useState } from 'react';
import api from '../api.js';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard(){
  const [latest,setLatest] = useState(null);
  useEffect(()=>{ (async () => { const { data } = await api.get('/simulate/history'); setLatest(data[0]); })(); },[]);
  if(!latest) return <div style={{padding:24}}>Run a simulation to see KPIs.</div>;
  const k = latest;
  const ontimeLate = [ { name: 'On-time', value: k.on_time }, { name: 'Late', value: k.late } ];
  const fuelData = [ { name: 'Fuel', value: k.fuel_cost }, { name: 'Bonus', value: k.bonus_total }, { name: 'Penalty', value: k.penalty_total } ];
  return (
    <div style={{display:'grid',gap:24,padding:24}}>
      <h2>Dashboard</h2>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        <Card title="Total Profit" value={`₹ ${k.total_profit.toFixed(2)}`} />
        <Card title="Efficiency" value={`${k.efficiency_score.toFixed(1)}%`} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:24}}>
        <div style={{height:320}}>
          <h3>On-time vs Late</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ontimeLate} dataKey="value" nameKey="name" outerRadius={100} label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{height:320}}>
          <h3>Fuel/Bonus/Penalty Breakdown</h3>
          <ResponsiveContainer>
            <BarChart data={fuelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
function Card({ title, value }){ return (<div style={{border:'1px solid #eee',padding:16,borderRadius:12,minWidth:220}}><div style={{fontSize:12,opacity:.7}}>{title}</div><div style={{fontSize:24,fontWeight:700}}>{value}</div></div>); }
