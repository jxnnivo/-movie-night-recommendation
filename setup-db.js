import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id BIGINT PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            poster TEXT,
            genre VARCHAR(255),
            votes INTEGER DEFAULT 0,
            link TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log('Table created successfully');
    await pool.end();
}

setupDatabase();