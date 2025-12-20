const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://deep-wood-frontend.vercel.app',
    'https://deep-wood.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
}));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Deep Wood API is running', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Deep Wood API - Use /api/* endpoints' });
});

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));

// Error handler
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Only listen on port if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
