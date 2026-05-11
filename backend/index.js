require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query } = require('./db');
const { getDefaultProgress } = require('./defaultProgress');

const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3001);
const sessions = new Map();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function ensureSchema() {
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

  await query(`
    CREATE TABLE IF NOT EXISTS user_workout_plans (
      user_id INTEGER PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
      plan_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function issueToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, userId);
  return token;
}

async function getUserByToken(token) {
  const userId = sessions.get(token);
  if (!userId) return null;
  const result = await query('SELECT id, username FROM app_users WHERE id = $1', [userId]);
  return result.rows[0] || null;
}

async function getProgress(userId) {
  const result = await query('SELECT progress_json FROM user_progress WHERE user_id = $1', [userId]);
  const row = result.rows[0];
  return {
    ...getDefaultProgress(),
    ...(row?.progress_json || {}),
  };
}

async function upsertProgress(userId, progress) {
  const merged = {
    ...getDefaultProgress(),
    ...(progress || {}),
  };

  await query(
    `
      INSERT INTO user_progress (user_id, progress_json, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET progress_json = EXCLUDED.progress_json, updated_at = NOW()
    `,
    [userId, JSON.stringify(merged)]
  );

  return merged;
}

async function ensureProgressRow(userId) {
  const current = await getProgress(userId);
  await upsertProgress(userId, current);
  return current;
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  getUserByToken(token)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid session' });
      }
      req.user = user;
      next();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Auth failed' });
    });
}

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await query('SELECT id, username, password_hash FROM app_users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const progress = await ensureProgressRow(user.id);
    const token = issueToken(user.id);

    res.json({
      token,
      user: { id: user.id, username: user.username },
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/me', authMiddleware, async (req, res) => {
  try {
    const progress = await ensureProgressRow(req.user.id);
    res.json({ user: req.user, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load profile' });
  }
});

app.get('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await getProgress(req.user.id);
    res.json({ ok: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load progress' });
  }
});

app.put('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await upsertProgress(req.user.id, req.body?.progress || {});
    res.json({ ok: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not save progress' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3–30 characters' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await query('SELECT id FROM app_users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const insertResult = await query(
      'INSERT INTO app_users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    );
    const user = insertResult.rows[0];
    const progress = await ensureProgressRow(user.id);
    const token = issueToken(user.id);

    res.json({
      token,
      user: { id: user.id, username: user.username },
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/workout-plan', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT plan_json FROM user_workout_plans WHERE user_id = $1', [req.user.id]);
    res.json({ ok: true, plan: result.rows[0]?.plan_json || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load workout plan' });
  }
});

app.post('/workout-plan', authMiddleware, async (req, res) => {
  try {
    const plan = req.body?.plan;
    if (!plan || typeof plan !== 'object') {
      return res.status(400).json({ error: 'Plan object is required' });
    }

    await query(
      `
        INSERT INTO user_workout_plans (user_id, plan_json, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET plan_json = EXCLUDED.plan_json, updated_at = NOW()
      `,
      [req.user.id, JSON.stringify(plan)]
    );

    res.json({ ok: true, plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not save workout plan' });
  }
});

app.post('/auth/logout', authMiddleware, async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

ensureSchema()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`HeroFit API listening on http://${HOST}:${PORT}`);
      console.log(`Local health: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to start API', error);
    process.exit(1);
  });
