import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Products
app.get('/api/products', (req, res) => {
  res.json(readDB().products);
});

// Cart
app.get('/api/cart', (req, res) => {
  res.json(readDB().cart);
});

app.post('/api/cart', (req, res) => {
  const db = readDB();
  const product = req.body;
  
  const cartItem = { ...product, cartId: Date.now().toString() };
  db.cart.push(cartItem);
  
  writeDB(db);
  res.json({ message: 'Added to cart', cart: db.cart });
});

app.delete('/api/cart/:cartId', (req, res) => {
  const db = readDB();
  const cartId = req.params.cartId;
  
  db.cart = db.cart.filter(item => item.cartId !== cartId);
  writeDB(db);
  res.json({ message: 'Removed from cart', cart: db.cart });
});

// Checkout
app.post('/api/checkout', (req, res) => {
  const db = readDB();
  if (db.cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const newOrder = {
    orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
    items: db.cart,
    total: db.cart.reduce((sum, item) => sum + item.price, 0),
    paymentDetails: req.body.paymentMethod,
    shippingDetails: req.body.shippingDetails || {},
    status: 'Processing',
    date: new Date().toISOString()
  };

  db.orders.push(newOrder);
  db.cart = [];
  writeDB(db);

  res.json({ message: 'Order placed successfully', orderId: newOrder.orderId });
});

// Order Tracking
app.get('/api/orders/:orderId', (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.get('/api/user/orders/:email', (req, res) => {
  const db = readDB();
  const orders = db.orders.filter(o => o.shippingDetails && o.shippingDetails.email === req.params.email);
  res.json(orders);
});

// Authentication
app.post('/api/signup', (req, res) => {
  const db = readDB();
  const { name, email, password } = req.body;

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: Date.now().toString(), name, email, password };
  db.users.push(newUser);
  writeDB(db);

  res.json({ message: 'Account created successfully', user: { name, email } });
});

app.post('/api/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
