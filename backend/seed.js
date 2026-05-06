require('dotenv').config();
const bcrypt = require('bcryptjs');
const { query } = require('./db');
const { getDefaultProgress } = require('./defaultProgress');

async function main() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id INTEGER PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
      progress_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const username = 'shazin354';
  const password = 'Chachu354';
  const passwordHash = await bcrypt.hash(password, 10);

  const userResult = await query(
    `
      INSERT INTO app_users (username, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (username)
      DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, username
    `,
    [username, passwordHash]
  );

  const user = userResult.rows[0];
  await query(
    `
      INSERT INTO user_progress (user_id, progress_json, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (user_id)
      DO NOTHING
    `,
    [user.id, JSON.stringify(getDefaultProgress())]
  );

  console.log(`Seeded account ${user.username}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
