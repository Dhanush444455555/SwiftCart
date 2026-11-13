/**
 * cli.js — Quick TiDB Cloud command line query runner
 *
 * Usage:
 *   node cli.js "SELECT COUNT(*) FROM products"
 *   node cli.js "SELECT id, name, price FROM products ORDER BY id DESC LIMIT 5"
 *   node cli.js (opens interactive SQL prompt)
 */
const pool = require('./db');
const readline = require('readline');

async function runQuery(sql) {
  try {
    const [rows] = await pool.query(sql);
    console.table(rows);
  } catch (err) {
    console.error('❌ SQL Error:', err.message);
  }
}

const argQuery = process.argv.slice(2).join(' ').trim();

if (argQuery) {
  runQuery(argQuery).then(() => process.exit(0));
} else {
  console.log('⚡ Connected to TiDB Cloud (swiftcart database)');
  console.log('Type any SQL query (e.g. SELECT id, name, price FROM products LIMIT 5;) or "exit" to quit:\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'tidb> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const query = line.trim();
    if (!query) { rl.prompt(); return; }
    if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
      process.exit(0);
    }
    await runQuery(query);
    rl.prompt();
  });
}

