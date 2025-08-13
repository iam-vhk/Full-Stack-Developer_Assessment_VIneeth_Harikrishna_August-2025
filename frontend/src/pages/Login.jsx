import { useState } from 'react';
import api from '../api.js';
import { login } from '../auth.js';

export default function Login(){
  const [email,setEmail] = useState('manager@example.com');
  const [password,setPassword] = useState('Pass@123');
  const [err,setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token); window.location.href = '/';
    } catch (e) { setErr(e?.response?.data?.message || 'Login failed'); }
  };
  return (
    <form onSubmit={submit} style={{maxWidth:360,margin:'48px auto',display:'grid',gap:12}}>
      <h2>Manager Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <div style={{color:'red'}}>{err}</div>}
      <button>Login</button>
    </form>
  );
}
