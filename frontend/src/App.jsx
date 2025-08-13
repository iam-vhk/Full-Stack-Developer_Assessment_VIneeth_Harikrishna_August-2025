import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Simulation from './pages/Simulation.jsx';
import Drivers from './pages/Drivers.jsx';
import RoutesPage from './pages/Routes.jsx';
import Orders from './pages/Orders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/simulation">Simulation</Link>
        <Link to="/drivers">Drivers</Link>
        <Link to="/routes">Routes</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/login" style={{marginLeft:'auto'}}>Login</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
        <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
