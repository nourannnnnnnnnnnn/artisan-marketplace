const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/market_reviews';

mongoose.connect(MONGO_URI)
  .then(() => console.log("Review Service Connected"))
  .catch(err => console.log(err));

// Updated Schema to match Frontend data
const ReviewSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  reviewer: String,
  text: String,
  rating: Number
});
const Review = mongoose.model('Review', ReviewSchema);

// Routes

// 1. Submit Review (Removed verifyToken for easier testing)
app.post('/reviews', async (req, res) => {
  try {
    const newReview = new Review({
      productId: req.body.productId,
      productName: req.body.productName,
      reviewer: req.body.reviewer || "Anonymous",
      text: req.body.text,
      rating: req.body.rating
    });
    
    await newReview.save();
    console.log("New Review Saved:", newReview);
    res.json("Review Saved!");
  } catch(err) { 
    console.error(err);
    res.status(500).json(err.message); 
  }
});

// 2. Get Reviews
app.get('/reviews', async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const allReviews = await Review.find(filter);
    res.json(allReviews);
  } catch(err) {
    res.status(500).json(err.message);
  }
});

app.listen(3002, () => console.log("Review Service running on 3002"));