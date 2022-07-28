require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET,
  PASSWORD: process.env.PASSWORD,
  PORT: process.env.PORT || 3001,
};
