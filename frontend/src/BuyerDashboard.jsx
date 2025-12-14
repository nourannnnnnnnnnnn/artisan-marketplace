import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BuyerDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Review State
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState({ id: '', name: '', type: 'product' }); 
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:3003/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
    if (modalOpen && reviewTarget.id) {
      axios.get(`http://localhost:3002/reviews?productId=${reviewTarget.id}`)
        .then(res => setReviews(res.data))
        .catch(console.error);
    }
  }, [modalOpen, reviewTarget]);

  const openReviewModal = (id, name, type) => {
    setReviewTarget({ id, name, type });
    setReviews([]); 
    setModalOpen(true);
  };

  const submitReview = async () => {
    try {
      await axios.post('http://localhost:3002/reviews', {
        productId: reviewTarget.id,
        productName: reviewTarget.name,
        reviewer: "Buyer", 
        text: reviewText,
        rating: parseInt(rating),
        type: reviewTarget.type 
      });
      alert("Review Submitted!");
      const res = await axios.get(`http://localhost:3002/reviews?productId=${reviewTarget.id}`);
      setReviews(res.data);
      setReviewText("");
    } catch (err) { 
  console.error(err); // 👈 Now 'err' is used!
  alert("Failed to submit."); 
}
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header with Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>🛒 Marketplace</h1>
          <button onClick={onLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '30px', textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <input placeholder="🔍 Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ddd' }} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Art">Art</option>
              <option value="Kitchen">Kitchen</option>
            </select>
        </div>

        {/* Product Grid */}
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredProducts.map(p => (
              <div key={p._id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                
                {/* 🖼️ IMAGE LOGIC: Show Real Image or Fallback Emoji */}
                <div style={{ height: '200px', background: '#ecf0f1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '50px' }}>🎁</span>
                  )}
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{p.name}</h3>
                  <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '18px', margin: '0 0 10px 0' }}>${p.price}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '14px', color: '#555', background: '#f9f9f9', padding: '8px', borderRadius: '5px' }}>
                    <span>Sold by: <strong>{p.seller || "Unknown"}</strong></span>
                    <button onClick={() => openReviewModal(p.seller || "Unknown", `Seller: ${p.seller}`, 'seller')} style={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', padding: '4px 8px' }}>⭐ Rate</button>
                  </div>

                  <button onClick={() => openReviewModal(p._id, p.name, 'product')} style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>💬 Review Product</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal (No changes needed here, just keeping it consistent) */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%' }}>
            <h2>Reviewing: {reviewTarget.name}</h2>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              <h4>Recent Reviews:</h4>
              {reviews.map((r, i) => <div key={i} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}><strong>{r.reviewer}</strong>: {r.text} ({r.rating}⭐)</div>)}
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write a review..." style={{ width: '100%', height: '80px', marginBottom: '15px', padding: '10px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <select value={rating} onChange={(e) => setRating(e.target.value)}><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option></select>
              <div><button onClick={() => setModalOpen(false)} style={{ marginRight: '10px' }}>Close</button><button onClick={submitReview} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 20px' }}>Submit</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}