const dotenv = require("dotenv");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_DB_URI;

dotenv.config();
console.log(
  `토큰 가져오는지 확인: ${ACCESS_TOKEN_SECRET} ${REFRESH_TOKEN_SECRET}`
);

module.exports = {
  applicationName: process.env.APPLICATION_NAME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  PORT,
  MONGO_URI,
};
