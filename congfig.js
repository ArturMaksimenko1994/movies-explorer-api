require('dotenv').config();

module.exports = {
  PORT: 3000,
  DB_ADDRESS: (process.env.NODE_ENV !== 'production') ? 'mongodb://localhost:27017/moviesdb' : process.env.MONGO_DB,
  JWT_SECRET: (process.env.NODE_ENV !== 'production') ? 'JWT_SECRET' : process.env.JWT_SECRET,
};
