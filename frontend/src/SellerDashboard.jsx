import { useState } from 'react';
import axios from 'axios';

export default function SellerDashboard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = async () => {
    try {
      await axios.post('http://localhost:3003/products', {
        name: name,
        price: Number(price),
        category: "General",
        tags: ["new"]
      }); 
      alert("Product Successfully Listed!");
      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to list product");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#fff8e1', minHeight: '100vh', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📦 Seller Dashboard</h1>
        <button onClick={() => window.location.reload()} style={{ background: '#333', color: '#fff', padding: '10px 20px', border: 'none' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
        
        {/* Left: Add Product Form */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ borderBottom: '2px solid orange', paddingBottom: '10px' }}>List a New Item</h2>
          
          <label style={{ display: 'block', marginTop: '15px', fontWeight: 'bold' }}>Product Name</label>
          <input 
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
            placeholder="e.g. Vintage Camera"
            value={name}
            onChange={e => setName(e.target.value)} 
          />

          <label style={{ display: 'block', marginTop: '15px', fontWeight: 'bold' }}>Price ($)</label>
          <input 
            type="number"
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
            placeholder="0.00"
            value={price}
            onChange={e => setPrice(e.target.value)} 
          />

          <button 
            onClick={addProduct} 
            style={{ width: '100%', marginTop: '20px', background: 'orange', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            🚀 Publish to Market
          </button>
        </div>

        {/* Right: Earnings Summary */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h2>💰 Your Earnings</h2>
          <div style={{ fontSize: '40px', color: '#2ecc71', fontWeight: 'bold', marginTop: '20px' }}>
            $1,250.00
          </div>
          <p style={{ color: '#777' }}>Total sales this month</p>
          <hr/>
          <p>Recent Sales:</p>
          <ul style={{ color: '#555' }}>
            <li>Wool Scarf - $30</li>
            <li>Ceramic Vase - $60</li>
            <li>Wooden Spoon - $15</li>
          </ul>
        </div>

      </div>
    </div>
  );
}