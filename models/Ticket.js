const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.ENUM('low', 'normal', 'high'), defaultValue: 'normal' },
  subject: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'in-progress', 'closed'), defaultValue: 'open' },
  resolvedBy: { type: DataTypes.STRING }, // Stores the name of the staff who replied
  resolutionNote: { type: DataTypes.TEXT } ,// 👈 Stores the actual reply
  conversation: { type: DataTypes.JSONB, defaultValue: [] }
});

module.exports = Ticket;