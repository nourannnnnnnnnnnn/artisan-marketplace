import { useState } from 'react';
import axios from 'axios';

// We don't need 'username' prop anymore, just 'onLogout'
export default function SellerDashboard({ onLogout }) {
  
  // 1. Add 'sellerName' and 'image' to the state
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: '', 
    category: 'General', 
    sellerName: '', // 👈 Manual Input
    image: '' 
  });

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3003/products', {
        ...newItem,
        price: Number(newItem.price),
        // 2. Use the name typed in the box, or default to "Unknown"
        seller: newItem.sellerName || "Anonymous Seller", 
        image: newItem.image || "", 
        tags: [] 
      });
      alert("Product Successfully Listed!");
      // Reset form (except maybe keep seller name? Up to you. Clearing all for now)
      setNewItem({ name: '', price: '', category: 'General', sellerName: '', image: '' });
    } catch (err) {
      console.error("Error listing product:", err);
      alert("Failed to list product.");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#fdf2e9' }}>
      <div style={{ padding: '20px', background: '#d35400', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📦 Seller Dashboard</h1>
        <button onClick={onLogout} style={{ background: 'white', color: '#d35400', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', padding: '40px', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>List a New Item</h2>
          <form onSubmit={handlePublish}>
            
            {/* 📝 SHOP NAME INPUT */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Your Shop Name</label>
              <input 
                placeholder="e.g. Noran's Store" 
                value={newItem.sellerName} 
                onChange={e => setNewItem({...newItem, sellerName: e.target.value})}
                style={inputStyle} 
                required 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product Name</label>
              <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price ($)</label>
              <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Image URL (Optional)</label>
              <input 
                placeholder="https://..." 
                value={newItem.image} 
                onChange={e => setNewItem({...newItem, image: e.target.value})}
                style={inputStyle} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={inputStyle}>
                <option>General</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home</option>
                <option>Art</option>
                <option>Kitchen</option>
              </select>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
              Publish to Market
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };