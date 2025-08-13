import { useEffect, useState } from 'react';
import api from '../api.js';
export default function RoutesPage(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ api.get('/routes').then(r=>setItems(r.data)); },[]);
  return (<div style={{padding:24}}><h2>Routes</h2>
    <ul>{items.map(i=> <li key={i.id}>#{i.id} • {i.distance_km} km • {i.traffic_level} • {i.base_time_min} min</li>)}</ul>
  </div>);
}
