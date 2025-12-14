import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Review State
  const [reviewTarget, setReviewTarget] = useState(null); 
  const [reviews, setReviews] = useState([]); // 👈 Store fetched reviews here
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  // 1. Fetch Real Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3003/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Fetch Reviews when a Product is clicked
  useEffect(() => {
    if (reviewTarget) {
      const fetchReviews = async () => {
        try {
          // Use _id (MongoDB default) or id (Static data)
          const pId = reviewTarget._id || reviewTarget.id;
          const res = await axios.get(`http://localhost:3002/reviews?productId=${pId}`);
          setReviews(res.data);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };
      fetchReviews();
    }
  }, [reviewTarget]);

  // 3. Submit Review
  const submitReview = async () => {
    if (!reviewTarget) return;
    try {
      const pId = reviewTarget._id || reviewTarget.id;
      
      await axios.post('http://localhost:3002/reviews', {
        productId: pId,
        productName: reviewTarget.name,
        reviewer: "Buyer", 
        text: reviewText,
        rating: parseInt(rating)
      });
      
      alert("Review Submitted Successfully!");
      
      // Refresh the reviews list immediately so it appears!
      const res = await axios.get(`http://localhost:3002/reviews?productId=${pId}`);
      setReviews(res.data);
      
      setReviewText("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ background: '#3498db', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🛒 ArtisanMarket</h1>
        <button onClick={() => window.location.reload()} style={{ background: 'white', color: '#3498db', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', gap: '20px' }}>
          <input 
            placeholder="🔍 Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
          <select onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}>
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
            {filteredProducts.map(product => (
              <div key={product._id || product.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '150px', background: '#ecf0f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>🎁</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                  <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '18px' }}>${product.price}</p>
                  <button 
                    onClick={() => setReviewTarget(product)}
                    style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    💬 View & Write Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>{reviewTarget.name}</h2>
            
            {/* Display Reviews List */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>📢 Recent Reviews</h4>
              {reviews.length === 0 ? <p style={{ color: '#888', fontStyle: 'italic' }}>No reviews yet. Be the first!</p> : (
                reviews.map((r, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{r.reviewer || "Anonymous"}</strong>
                      <span style={{ color: '#f1c40f' }}>{"⭐".repeat(r.rating)}</span>
                    </div>
                    <p style={{ margin: '5px 0', color: '#555' }}>{r.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <textarea 
              placeholder="Write your review..." 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ width: '100%', height: '80px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <div style={{ marginBottom: '20px' }}>
              <label>Rating: </label>
              <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '5px' }}>
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="2">⭐⭐</option>
                <option value="1">⭐</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setReviewTarget(null)} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
              <button onClick={submitReview} style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}