const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING },
  season: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING },
  blurb: { type: DataTypes.TEXT },
  priceWithBike: { type: DataTypes.FLOAT },
  priceNoBike: { type: DataTypes.FLOAT },
  
  // ── CHANGE THIS LINE ──────────────────────────────────
  imageUrl: { type: DataTypes.TEXT }, // Changed from STRING to TEXT
  // ──────────────────────────────────────────────────────
  
  tags: { 
  type: DataTypes.JSONB, 
  // Use a string for the default to avoid confusion with Postgres native arrays
  defaultValue: '[]' 
},
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
    defaultValue: 'pending' 
  },
  createdBy: { type: DataTypes.STRING }
});

module.exports = Trip;