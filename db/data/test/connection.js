const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool();

console.log(process);
module.exports = pool;
