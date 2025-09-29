const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' });

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost', // We're connecting from the host machine
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  },
);

// Import models (we'll define them directly here for simplicity)
const { DataTypes } = require('sequelize');

// Define the User model
const User = sequelize.define(
  'User',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'admin', 'operator', 'user'),
      defaultValue: 'user',
    },
    loyality_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  },
);

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Creating tables...');
    await sequelize.sync({ force: true }); // This will create tables, dropping them first if they exist
    console.log('Tables created successfully.');

    console.log('Database initialization completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
