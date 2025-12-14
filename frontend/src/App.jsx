import { useState } from 'react';
import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  // ✅ 1. DEFINE LOGOUT FUNCTION
  const handleLogout = () => {
    setUserRole(null); // This clears the user and forces the Login Page to show
  };

  // If not logged in, show Login Page
  if (!userRole) {
    return <LoginPage onLogin={(role) => setUserRole(role)} />;
  }

  // ✅ 2. PASS 'onLogout' TO DASHBOARDS
  if (userRole === 'admin') return <AdminDashboard onLogout={handleLogout} />;
  if (userRole === 'seller') return <SellerDashboard onLogout={handleLogout} />;
  if (userRole === 'buyer') return <BuyerDashboard onLogout={handleLogout} />;
  
  return <div>Unknown Role</div>;
}

export default App;