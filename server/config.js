const path = require('path');

const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 4001);
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || '').replace(
  /\/+$/,
  ''
);
const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const DB_FILE = path.resolve(__dirname, 'data', 'db.json');

module.exports = {
  PORT,
  PUBLIC_BASE_URL,
  ACCESS_TOKEN_TTL_MS,
  RESET_TOKEN_TTL_MS,
  DB_FILE
};
