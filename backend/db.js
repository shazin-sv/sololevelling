require('dotenv').config();
const dns = require('dns').promises;
const { URL } = require('url');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

let poolPromise;

async function createPool() {
  const connectionUrl = new URL(process.env.DATABASE_URL);
  const hostname = connectionUrl.hostname;
  const ipv4Addresses = await dns.lookup(hostname, { family: 4, all: true });

  if (!ipv4Addresses.length) {
    throw new Error(`Could not resolve an IPv4 address for ${hostname}`);
  }

  return new Pool({
    host: ipv4Addresses[0].address,
    port: Number(connectionUrl.port || 5432),
    user: decodeURIComponent(connectionUrl.username),
    password: decodeURIComponent(connectionUrl.password),
    database: connectionUrl.pathname.replace(/^\//, ''),
    ssl: {
      rejectUnauthorized: false,
      servername: hostname,
    },
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = createPool();
  }
  return poolPromise;
}

async function query(text, params = []) {
  const pool = await getPool();
  const result = await pool.query(text, params);
  return { rows: result.rows };
}

module.exports = { query };
