import { useState } from 'react';
import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(""); // 👈 Store the username here

  const handleLogin = (role, name) => {
    setUserRole(role);
    setUsername(name); // 👈 Save it when they login
  };

  const handleLogout = () => {
    setUserRole(null);
    setUsername("");
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ✅ Pass 'username' prop to SellerDashboard
  if (userRole === 'admin') return <AdminDashboard onLogout={handleLogout} />;
  if (userRole === 'seller') return <SellerDashboard onLogout={handleLogout} username={username} />;
  if (userRole === 'buyer') return <BuyerDashboard onLogout={handleLogout} />;
  
  return <div>Unknown Role</div>;
}

export default App;