const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceConfig = sequelize.define('ServiceConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,          // single-row config table
  },
  services: {
    type: DataTypes.JSONB,    // array of service objects
    allowNull: false,
    defaultValue: [],
  },
  settings: {
    type: DataTypes.JSONB,    // global config object
    allowNull: false,
    defaultValue: {
      ratePerKm: 10,
      unserviceableKm: 70,
      disabledKm: 700,
      onlinePaymentThresholdKm: 5,
      fixedLocation: { lat: 12.89806, lng: 77.61442 },
    },
  },
});

module.exports = ServiceConfig;