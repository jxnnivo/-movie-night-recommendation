import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function readPosts() {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
}

export async function writePosts(post) {
    const { id, title, description, poster, genre, votes, link } = post;
    await pool.query(
        'INSERT INTO posts (id, title, description, poster, genre, votes, link) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, title, description, poster, genre, votes, link]
    );
}