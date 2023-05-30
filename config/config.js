require("dotenv").config();
const config = {
    development: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT,
    },
    test: {
      username: process.env.DB_USERNAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_NAME_TEST,
      host: process.env.DB_HOST_TEST,
      dialect: "postgres",
      port: process.env.DB_PORT_TEST,
      
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT,
      url : process.env.DB_URL
    },
  }
  
  
  module.exports = config