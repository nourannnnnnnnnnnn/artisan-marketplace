import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'buyer');
  
  // Auth State
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleInput, setRoleInput] = useState('buyer'); // Register as Buyer/Seller

  // Data State
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Review State
  const [reviewType, setReviewType] = useState('product'); // 'product' or 'seller'
  const [targetName, setTargetName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(5);

  // --- 1. AUTH ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';
    try {
      const payload = isRegistering 
        ? { email, password, role: roleInput } 
        : { email, password };
        
      const res = await axios.post(`http://localhost:3001/auth${endpoint}`, payload);
      
      if (isRegistering) {
        alert("Registered! Please Login.");
        setIsRegistering(false);
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', res.data.role); // Save Role
        setToken(res.data.token);
        setUserRole(res.data.role);
      }
    } catch (err) { alert("Auth Failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
  };

  // --- 2. LOAD DATA (With Search) ---
  const fetchProducts = async () => {
    try {
      // Pass Search & Category to Backend
      const res = await axios.get(`http://localhost:3003/products?search=${searchTerm}&category=${categoryFilter}`);
      setProducts(res.data);
      if(res.data.length > 0 && reviewType === 'product') setTargetName(res.data[0].name);
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/reviews?type=${reviewType}`);
      setReviews(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
    fetchReviews();
  }, [token, searchTerm, categoryFilter, reviewType]); // Reload when these change

  // --- 3. SEED ---
  const seedProducts = async () => {
    await axios.post('http://localhost:3003/products/seed');
    window.location.reload();
  };

  // --- 4. SUBMIT REVIEW ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/reviews', 
        { targetName, type: reviewType, text: reviewText, stars }, 
        { headers: { Authorization: token } }
      );
      alert("Review Posted!");
      fetchReviews();
      setReviewText('');
    } catch (err) { alert("Error posting review"); }
  };

  // --- RENDER ---
  if (!token) {
    return (
      <div className="login-container">
        <div className="auth-box">
          <h2>{isRegistering ? "📝 Join Us" : "👋 Welcome Back"}</h2>
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            
            {/* ROLE SELECTOR (Only when registering) */}
            {isRegistering && (
              <div style={{marginBottom:'15px'}}>
                <label>I am a: </label>
                <select value={roleInput} onChange={e=>setRoleInput(e.target.value)}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          <p style={{marginTop:'1.5rem', cursor:'pointer', color:'#666'}} onClick={()=>setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "Create Account"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="logo">🛍️ Market ({userRole.toUpperCase()})</div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-grid">
        <div className="main-content">
          
          {/* SEARCH & FILTER BAR */}
          <div className="review-panel" style={{display:'flex', gap:'10px', alignItems:'center'}}>
            <input placeholder="🔍 Search products..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} style={{width:'150px', margin:0}}>
              <option value="All">All Categories</option>
              <option value="Home">Home</option>
              <option value="Art">Art</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>

          <div className="section-title">
            <span>Products</span>
            {products.length === 0 && <button onClick={seedProducts}>Load Data</button>}
          </div>

          <div className="product-grid">
            {products.map(p => (
              <div key={p._id} className="product-card">
                <div className="product-img">🎁</div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">
                    {p.tags.map(t => <span key={t} className="badge" style={{marginRight:'5px'}}>#{t}</span>)}
                  </div>
                  <div className="product-price">${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar">
          {/* REVIEW FORM WITH TOGGLE */}
          <div className="review-panel" style={{borderTop:'4px solid #4f46e5'}}>
            <h3>✍️ Write a Review</h3>
            
            <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
              <button onClick={()=>setReviewType('product')} style={{background: reviewType==='product'?'#4f46e5':'#ddd'}}>Product</button>
              <button onClick={()=>setReviewType('seller')} style={{background: reviewType==='seller'?'#ec4899':'#ddd'}}>Seller</button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div style={{marginBottom:'10px'}}>
                <label>Target Name:</label>
                {reviewType === 'product' ? (
                  <select value={targetName} onChange={e=>setTargetName(e.target.value)}>
                    {products.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                  </select>
                ) : (
                  <input placeholder="Enter Seller Name (e.g. John Doe)" value={targetName} onChange={e=>setTargetName(e.target.value)} />
                )}
              </div>
              
              <textarea placeholder="Your experience..." value={reviewText} onChange={e=>setReviewText(e.target.value)} />
              <select value={stars} onChange={e=>setStars(Number(e.target.value))}>
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
                <option value="3">★★★</option>
              </select>
              <button type="submit">Post {reviewType === 'seller' ? 'Seller' : ''} Review</button>
            </form>
          </div>

          {/* REVIEWS LIST */}
          <div className="review-panel">
            <h3>💬 {reviewType === 'seller' ? 'Seller' : 'Product'} Reviews</h3>
            {reviews.map((r, i) => (
              <div key={i} className="review-item">
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span className="badge">{r.targetName}</span>
                  <span className="stars">{"★".repeat(r.stars)}</span>
                </div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;