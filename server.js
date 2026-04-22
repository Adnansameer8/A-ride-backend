const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const tripRoutes = require('./routes/tripRoutes'); 
const supportRoutes = require('./routes/supportRoutes');
const servicesRoutes = require('./routes/servicesRoutes');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to make requests

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trips', tripRoutes);

app.use('/api/support/tickets', supportRoutes);
app.use('/api/services', servicesRoutes); 
// Database Sync and Server Start
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('✅ PostgreSQL Database Synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err);
  });