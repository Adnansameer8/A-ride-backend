const { Sequelize } = require('sequelize');
const path = require('path');

// This forces dotenv to look one folder up (in the root directory) for the .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Supabase connections
    }
  }
});

module.exports = sequelize;