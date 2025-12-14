import { useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: 1, email: "buyer@test.com", role: "buyer" },
    { id: 2, email: "seller@test.com", role: "seller" },
    { id: 3, email: "admin@test.com", role: "admin" }
  ]);

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    alert("User deleted from database");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2>🛡️ SUPER ADMIN</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          <li style={{ padding: '10px', background: '#34495e', marginBottom: '5px' }}>👥 Manage Users</li>
          <li style={{ padding: '10px' }}>⚙️ System Settings</li>
          <li style={{ padding: '10px' }}>📜 View Audit Logs</li>
          <li style={{ padding: '10px', color: '#e74c3c', cursor: 'pointer' }} onClick={() => window.location.reload()}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#ecf0f1' }}>
        <h1>System Overview</h1>
        
        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1 }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{users.length}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1 }}>
            <h3>System Status</h3>
            <p style={{ color: 'green', fontWeight: 'bold' }}>🟢 Operational</p>
          </div>
        </div>

        {/* User Management Table */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>User Database</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{user.id}</td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      background: user.role === 'admin' ? '#e74c3c' : (user.role === 'seller' ? '#f39c12' : '#3498db'),
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}