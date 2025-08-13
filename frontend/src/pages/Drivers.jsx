import { useEffect, useState } from 'react';
import api from '../api.js';
export default function Drivers(){
  const [items,setItems]=useState([]); const [name,setName]=useState('');
  useEffect(()=>{ api.get('/drivers').then(r=>setItems(r.data)); },[]);
  const add=async()=>{ const {data}=await api.post('/drivers',{name,shift_hours:0,past_week_hours:''}); setItems([...items,data]); setName(''); };
  return (<div style={{padding:24}}><h2>Drivers</h2>
    <div style={{display:'flex',gap:8}}><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><button onClick={add}>Add</button></div>
    <ul>{items.map(i=> <li key={i.id}>{i.name} • shift {i.shift_hours}h</li>)}</ul>
  </div>);
}
