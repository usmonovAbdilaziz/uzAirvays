const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
);

// Import models
const { MODELS } = require('./dist/models');

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Load models
    sequelize.addModels(MODELS);

    console.log('Synchronizing database...');
    await sequelize.sync({ force: true }); // This will create tables, dropping them first if they exist
    console.log('Database synchronized successfully.');

    console.log('Database initialization completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
