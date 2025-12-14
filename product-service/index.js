const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/market_products';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Product Service Connected");
    
    // 💣 FORCE RESET: Delete all old products first!
    await Product.deleteMany({});
    console.log("🗑️ Old products deleted.");

    // Now insert the new ones with CORRECT images
    const sampleProducts = [
      { 
        name: "Vintage Camera", 
        price: 120, 
        category: "Electronics", 
        seller: "RetroShop", 
        tags: ["old", "photo"],
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60"
      },
      { 
        name: "Handmade Vase", 
        price: 60, 
        category: "Art", 
        seller: "ArtisanAlice", 
        tags: ["clay", "blue"],
        image: "https://plus.unsplash.com/premium_photo-1664202219403-ca228a420fbe?w=600&auto=format&fit=crop&q=60"
      },
      { 
        name: "Leather Jacket", 
        price: 250, 
        category: "Clothing", 
        seller: "FashionHub", 
        tags: ["warm", "style"],
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60"
      },
      { 
        name: "Organic Honey", 
        price: 15, 
        category: "Kitchen", 
        seller: "BeeHappy", 
        tags: ["food", "sweet"],
        image: "https://plus.unsplash.com/premium_photo-1723507342569-4c3422a811b8?w=600&auto=format&fit=crop&q=60"
      }
    ];
    
    await Product.insertMany(sampleProducts);
    console.log("✅ New Products with Real Images Seeded!");

  })
  .catch(err => console.log(err));

// Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  seller: String,
  image: String,
  tags: [String]
});
const Product = mongoose.model('Product', ProductSchema);

// Routes
app.get('/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    
    const products = await Product.find(query);
    res.json(products);
  } catch(err) { res.status(500).json(err.message); }
});

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