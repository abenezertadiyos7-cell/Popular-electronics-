const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let products = [
  {
    id: 1,
    name: "Nike Blazer Low '77 Jumbo",
    category: "Women's Shoes",
    price: 120.11,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80",
    favorite: false,
    brand: "Nike"
  },
  {
    id: 2,
    name: "Nike Air Force 1 '07 LVB Next Nature",
    category: "Men's Shoes",
    price: 230.11,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80",
    favorite: true,
    brand: "Nike"
  },
  {
    id: 3,
    name: "Nike Air Max 90",
    category: "Men's Shoes",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=300&q=80",
    favorite: false,
    discount: "10% off",
    brand: "Nike"
  },
  {
    id: 4,
    name: "Adidas Ultraboost",
    category: "Running Shoes",
    price: 190.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
    favorite: false,
    discount: "15% off",
    brand: "Adidas"
  }
];

let cart = [];
let favorites = [2];

const users = [
  { id: 1, email: "user@example.com", password: "password123", name: "John Doe" }
];

app.get('/api/products/new-arrivals', (req, res) => {
  setTimeout(() => {
    res.json(products.filter(p => [1,2].includes(p.id)));
  }, 300);
});

app.get('/api/products/best-sellers', (req, res) => {
  const brand = req.query.brand;
  let filtered = products.filter(p => [3,4].includes(p.id));
  if (brand && brand !== 'All') {
    filtered = products.filter(p => p.brand === brand);
  }
  setTimeout(() => {
    res.json(filtered);
  }, 300);
});

app.post('/api/cart/add', (req, res) => {
  const { id } = req.body;
  const product = products.find(p => p.id === id);
  if (product) {
    cart.push(product);
    res.json({ success: true, cart });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/favorites', (req, res) => {
  res.json(favorites);
});

app.post('/api/favorites/toggle', (req, res) => {
  const { id } = req.body;
  const index = favorites.indexOf(id);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  res.json({ favorites });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = Buffer.from(JSON.stringify({ id: user.id, email })).toString('base64');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get('/api/user/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(' ')[1];
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = users.find(u => u.id === payload.id);
    if (user) {
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Shopink API running at http://localhost:${PORT}`);
});
