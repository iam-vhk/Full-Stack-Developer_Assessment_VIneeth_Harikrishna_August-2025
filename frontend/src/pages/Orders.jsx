import { useEffect, useState } from 'react';
import api from '../api.js';
export default function Orders(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ api.get('/orders').then(r=>setItems(r.data)); },[]);
  return (<div style={{padding:24}}><h2>Orders</h2>
    <ul>{items.map(i=> <li key={i.id}>#{i.id} • ₹{i.value_rs} • Route {i.route_id} • {i.delivery_time}</li>)}</ul>
  </div>);
}
