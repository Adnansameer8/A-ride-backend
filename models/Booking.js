const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  
  // ── NEW EXPLICIT COLUMNS FOR THE DASHBOARD ──
  locationLink: {
    type: DataTypes.TEXT, // TEXT allows long Google Maps URLs
    allowNull: true,
  },
  bikeNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  distanceKm: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  eta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extraDetails: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // ─────────────────────────────────────────────

  details: {
    type: DataTypes.JSONB, 
    // We keep this as a backup for older bookings
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending',
  }
});

// Setup Database Relationships
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

module.exports = Booking;