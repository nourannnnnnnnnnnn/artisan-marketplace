const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/market_products';

mongoose.connect(MONGO_URI)
  .then(() => console.log("Product Service Connected"))
  .catch(err => console.log(err));

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  tags: [String]
});
const Product = mongoose.model('Product', ProductSchema);

// --- ROUTES ---

// 1. Seed Data
app.post('/products/seed', async (req, res) => {
  const sampleProducts = [
    { name: "Handwoven Basket", price: 45, category: "Home", tags: ["eco", "handmade"] },
    { name: "Ceramic Vase", price: 60, category: "Art", tags: ["clay", "blue"] },
    { name: "Wool Scarf", price: 30, category: "Clothing", tags: ["winter", "soft"] },
    { name: "Wooden Spoon", price: 15, category: "Kitchen", tags: ["eco", "cooking"] }
  ];
  await Product.deleteMany({}); 
  await Product.insertMany(sampleProducts);
  res.json("Seeded with Tags!");
});

// 2. Get All Products (Buyer)
app.get('/products', async (req, res) => {
  try {
    const { search, category, tag } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    if (tag) query.tags = tag;
    const products = await Product.find(query);
    res.json(products);
  } catch(err) { res.status(500).json(err.message); }
});

// 3. Add New Product (Seller) <--- THIS IS THE MISSING PART
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log("New Product Saved:", newProduct.name);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(3003, () => console.log("Product Service running on 3003"));