
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // Default role

  const handleAuth = async () => {
    try {
      const endpoint = isRegistering ? '/register' : '/login';
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        email,
        password,
        role
      });
      
      if (response.data.token) {
        onLogin(response.data.role); 
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Authentication Failed. Check console.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🛍️</div>
          <h2 style={styles.title}>Artisan Market</h2>
          <p style={styles.subtitle}>{isRegistering ? "Create Account" : "Welcome Back"}</p>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a...</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
              <option value="buyer">🛒 Buyer</option>
              <option value="seller">📦 Seller</option>
              <option value="admin">🛡️ Admin</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input}/>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input}/>
          </div>

          <button onClick={handleAuth} style={styles.button}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>{isRegistering ? "Already have an account?" : "New here?"}</p>
          <button onClick={() => setIsRegistering(!isRegistering)} style={styles.link}>
            {isRegistering ? "Login here" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' },
  card: { background: 'white', width: '100%', maxWidth: '400px', borderRadius: '15px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { textAlign: 'center' },
  icon: { fontSize: '40px', marginBottom: '10px' },
  title: { margin: '0', fontSize: '28px', color: '#333' },
  subtitle: { margin: '5px 0 0', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '5px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', background: 'white' },
  button: { padding: '14px', borderRadius: '8px', border: 'none', background: '#5a67d8', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  footer: { textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' },
  footerText: { margin: '0 0 5px', color: '#888', fontSize: '14px' },
  link: { background: 'none', border: 'none', color: '#5a67d8', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }
};