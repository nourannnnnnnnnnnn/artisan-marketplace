import { useState } from 'react';
import LoginPage from './LoginPage'; // 👈 Import the new file
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  // If no user is logged in, show the styled Login Page
  if (!userRole) {
    return <LoginPage onLogin={(role) => setUserRole(role)} />;
  }

  // Otherwise, route to the correct dashboard
  if (userRole === 'admin') return <AdminDashboard />;
  if (userRole === 'seller') return <SellerDashboard />;
  if (userRole === 'buyer') return <BuyerDashboard />;
  
  return <div>Unknown Role</div>;
}

export default App;