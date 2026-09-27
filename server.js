const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let products = [
  { id: 1, name: 'Margherita Pizza', price: 249, category: 'Pizza' },
  { id: 2, name: 'Veg Burger', price: 149, category: 'Burger' },
  { id: 3, name: 'French Fries', price: 99, category: 'Sides' }
];

let orders = [];
let nextProductId = 4;
let nextOrderId = 1;

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = auth.slice(7);
  if (token !== 'demo-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email !== 'student@example.com' || password !== 'password123') {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({
    message: 'Login successful',
    token: 'demo-token'
  });
});

// ---------------- PRODUCTS CRUD ----------------

app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Product ID must be an integer' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(200).json(product);
});

app.post('/api/products', requireAuth, (req, res) => {
  const { name, price, category } = req.body || {};

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      error: 'name, price and category are required'
    });
  }

  if (typeof name !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'name and category must be strings' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'price must be a positive number' });
  }

  const duplicate = products.find(
    p => p.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({ error: 'Product already exists' });
  }

  const product = { id: nextProductId++, name, price, category };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Product ID must be an integer' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, category } = req.body || {};

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      error: 'name, price and category are required'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'price must be a positive number' });
  }

  product.name = name;
  product.price = price;
  product.category = category;

  res.status(200).json(product);
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Product ID must be an integer' });
  }

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const [deleted] = products.splice(index, 1);
  res.status(200).json({ message: 'Product deleted', product: deleted });
});

// ---------------- ORDERS ----------------

app.post('/api/orders', requireAuth, (req, res) => {
  const { customerEmail, productId, quantity } = req.body || {};

  if (!customerEmail || productId === undefined || quantity === undefined) {
    return res.status(400).json({
      error: 'customerEmail, productId and quantity are required'
    });
  }

  const product = products.find(p => p.id === Number(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be a positive integer' });
  }

  const duplicate = orders.find(
    o => o.customerEmail === customerEmail &&
         o.productId === Number(productId) &&
         o.status === 'PENDING'
  );

  if (duplicate) {
    return res.status(409).json({
      error: 'Duplicate pending order for this product'
    });
  }

  const order = {
    id: nextOrderId++,
    customerEmail,
    productId: Number(productId),
    quantity,
    total: product.price * quantity,
    status: 'PENDING'
  };

  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', requireAuth, (req, res) => {
  res.status(200).json(orders);
});

app.post('/api/orders/:id/pay', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status === 'PAID') {
    return res.status(409).json({ error: 'Order has already been paid' });
  }

  order.status = 'PAID';
  res.status(200).json({ message: 'Payment confirmed', order });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Food Delivery API running at http://localhost:${PORT}`);
});
